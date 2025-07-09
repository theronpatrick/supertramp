import { useState, useEffect, useRef } from "preact/hooks";
import albums from "./data/albums";
import cachedData from "./data/api/cache.25.7.8";
import styles from "./App.module.less";

console.log("Version 25.7.8.n");

// Customizable timing constants
const FEEDBACK_ANIMATION_DURATION = 500; // milliseconds
const POINTS_CORRECT = 100;
const POINTS_INCORRECT = -50;

const loadAlbumData = async (albumId) => {
  const cachedAlbum = cachedData[albumId];
  if (cachedAlbum) {
    return cachedAlbum;
  } else {
    console.error("Album not found in cache:", albumId);
    return null;
  }
};

const preloadImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => resolve(url);
    img.src = url;
  });
};

export function App() {
  const [allImages, setAllImages] = useState([]);
  const [allParkNames, setAllParkNames] = useState([]);
  const [currentImageData, setCurrentImageData] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null); // 'correct' or 'incorrect'
  const [showFeedback, setShowFeedback] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const imageCache = useRef(new Map());

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateOptions = (correctParkName, allParkNames) => {
    // Create a copy of all park names and remove the correct one
    const incorrectOptions = allParkNames.filter(
      (name) => name !== correctParkName
    );

    // Shuffle and take 3 random incorrect options
    const shuffledIncorrect = shuffleArray(incorrectOptions);
    const selectedIncorrect = shuffledIncorrect.slice(0, 3);

    // Create options array with correct answer and 3 incorrect ones
    const options = [correctParkName, ...selectedIncorrect];

    // Shuffle the options and track where the correct answer ended up
    const shuffledOptions = shuffleArray(options);
    const correctIndex = shuffledOptions.indexOf(correctParkName);

    return { options: shuffledOptions, correctIndex };
  };

  const cacheImages = async (images, startIndex) => {
    const cachePromises = [];
    for (let i = 0; i < 10 && startIndex + i < images.length; i++) {
      const imageData = images[startIndex + i];
      if (!imageCache.current.has(imageData.url)) {
        cachePromises.push(preloadImage(imageData.url));
      }
    }

    const cachedUrls = await Promise.all(cachePromises);
    cachedUrls.forEach((url) => imageCache.current.set(url, true));
  };

  const handleButtonClick = (selectedIndex) => {
    if (buttonsDisabled) return;

    setButtonsDisabled(true);
    const isCorrect = selectedIndex === correctAnswerIndex;

    // Update score
    setScore(
      (prevScore) => prevScore + (isCorrect ? POINTS_CORRECT : POINTS_INCORRECT)
    );

    // Show feedback
    setFeedbackType(isCorrect ? "correct" : "incorrect");
    setShowFeedback(true);

    // After animation, proceed to next image
    setTimeout(() => {
      setShowFeedback(false);
      setButtonsDisabled(false);
      proceedToNextImage();
    }, FEEDBACK_ANIMATION_DURATION);
  };

  const proceedToNextImage = () => {
    if (currentImageIndex < allImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      const nextImageData = allImages[nextIndex];

      setCurrentImageIndex(nextIndex);
      setCurrentImageData(nextImageData);

      const { options, correctIndex } = generateOptions(
        nextImageData.parkName,
        allParkNames
      );
      setCurrentOptions(options);
      setCorrectAnswerIndex(correctIndex);

      // Cache next 10 images
      cacheImages(allImages, nextIndex + 1);
    }
  };

  const handleImageClick = () => {
    // Only allow image click if buttons are not disabled and no feedback is showing
    if (!buttonsDisabled && !showFeedback) {
      proceedToNextImage();
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setScore(0);
    setShowFeedback(false);
    setButtonsDisabled(false);
    // Trigger re-fetch by calling the effect again
    window.location.reload();
  };

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const imageData = [];
        const parkNames = [];

        // Convert albums object to array of entries and iterate
        for (const [parkName, albumInfo] of Object.entries(albums)) {
          const albumData = await loadAlbumData(albumInfo.url);
          if (albumData && albumData.images) {
            // Add park name to our collection
            if (!parkNames.includes(albumData.parkName)) {
              parkNames.push(albumData.parkName);
            }

            // Associate park name with each image
            albumData.images.forEach((img) => {
              imageData.push({
                url: img.link,
                parkName: albumData.parkName,
              });
            });
          }
        }

        if (imageData.length > 0) {
          const shuffledImages = shuffleArray(imageData);
          setAllImages(shuffledImages);
          setAllParkNames(parkNames);

          // Preload the first image before showing the UI
          const firstImageData = shuffledImages[0];
          await preloadImage(firstImageData.url);
          setCurrentImageData(firstImageData);
          setCurrentImageIndex(0);

          const { options, correctIndex } = generateOptions(
            firstImageData.parkName,
            parkNames
          );
          setCurrentOptions(options);
          setCorrectAnswerIndex(correctIndex);

          // Cache the first 10 images
          cacheImages(shuffledImages, 1);
        }
      } catch (err) {
        console.error("Error fetching album data:", err);
        setError("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllImages();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>🦬</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={handleRetry}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className={styles.app}>
        <div className={styles.noImagesContainer}>
          <div className={styles.noImagesContent}>
            <h2>No images found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {/* Score display in top left */}
      <div className={styles.scoreDisplay}>
        {score.toString().padStart(4, "0")}
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.imageSection}>
          <div className={styles.imageContainer} onClick={handleImageClick}>
            <img
              src={currentImageData?.url}
              alt="National Park"
              className={styles.galleryImage}
            />

            {/* Feedback animation overlay */}
            {showFeedback && (
              <div
                className={`${styles.feedbackOverlay} ${styles[feedbackType]}`}
              >
                <div className={styles.feedbackEmoji}>
                  {feedbackType === "correct" ? "✅" : "❌"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.gameMenu}>
          <div className={styles.menuButtons}>
            {currentOptions.map((option, index) => (
              <button
                key={index}
                className={`${styles.menuButton} ${
                  buttonsDisabled ? styles.disabled : ""
                }`}
                onClick={() => handleButtonClick(index)}
                disabled={buttonsDisabled}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
