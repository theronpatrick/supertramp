import { useState, useEffect, useRef } from "preact/hooks";
import { useLocation } from "react-router-dom";
import cachedData from "./data/api/cache.25.7.12";
import styles from "./App.module.less";

console.log("Version 25.7.13.a");

// Customizable timing constants
const FEEDBACK_ANIMATION_DURATION = 500; // milliseconds
const POINTS_CORRECT = 100;
const POINTS_INCORRECT = -50;
const TIMER_DURATION = 30; // seconds for timed mode
const LEADERBOARD_FLIP_DELAY = 2500; // milliseconds before flipping to leaderboard

// Animal leaderboard categories
const LEADERBOARD_CATEGORIES = [
  { threshold: 2000, name: "Best Buffalo", emoji: "🐃" },
  { threshold: 1500, name: "Hype Hippo", emoji: "🦛" },
  { threshold: 1000, name: "Dang Good Deer", emoji: "🦌" },
  { threshold: 500, name: "Reasonable Rabbit", emoji: "🐰" },
  { threshold: 200, name: "Okay Otter", emoji: "🦦" },
  { threshold: 0, name: "Mediocre Moose", emoji: "🫎" },
  { threshold: -500, name: "Slow Sloth", emoji: "🦥" },
  { threshold: -1000, name: "Pathetic Pig", emoji: "🐷" },
];

// High score management
const getHighScore = () => {
  const stored = localStorage.getItem("bisonBrawlHighScore");
  return stored ? parseInt(stored, 10) : -9999;
};

const setHighScore = (score) => {
  localStorage.setItem("bisonBrawlHighScore", score.toString());
};

const getUserCategory = (score) => {
  for (const category of LEADERBOARD_CATEGORIES) {
    if (score >= category.threshold) {
      return category;
    }
  }
  return LEADERBOARD_CATEGORIES[LEADERBOARD_CATEGORIES.length - 1];
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
  const location = useLocation();
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
  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);
  const [showButtonFeedback, setShowButtonFeedback] = useState(false);

  // Game mode and timer states
  const [gameMode, setGameMode] = useState("timed"); // 'timed' or 'timeless'
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showTimeBonus, setShowTimeBonus] = useState(false);
  const [scoreBonusInstances, setScoreBonusInstances] = useState([]);

  // Leaderboard states
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [highScore, setHighScoreState] = useState(getHighScore());

  const imageCache = useRef(new Map());
  const timerRef = useRef(null);
  const scoreBonusIdCounter = useRef(0);

  // Check URL parameters for game mode
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const mode = urlParams.get("mode");
    console.log("mode", mode);
    if (mode === "timeless" || mode === "timed") {
      setGameMode(mode);
    }
  }, [location.search]);

  // Timer logic for timed mode
  useEffect(() => {
    if (gameMode === "timed" && gameStarted && !gameOver && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameMode, gameStarted, gameOver, timeLeft]);

  // Handle game over and high score logic
  useEffect(() => {
    if (gameOver) {
      const currentHighScore = getHighScore();
      if (score > currentHighScore) {
        setHighScore(score);
        setHighScoreState(score);
        setIsNewHighScore(true);
      }

      // Show leaderboard after delay
      const timer = setTimeout(() => {
        setShowLeaderboard(true);
      }, LEADERBOARD_FLIP_DELAY);

      return () => clearTimeout(timer);
    }
  }, [gameOver, score]);

  // Start the game timer when images are loaded
  useEffect(() => {
    if (!isLoading && !error && allImages.length > 0 && gameMode === "timed") {
      setGameStarted(true);
    }
  }, [isLoading, error, allImages, gameMode]);

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
    if (buttonsDisabled || gameOver) return;

    setButtonsDisabled(true);
    setClickedButtonIndex(selectedIndex);
    setShowButtonFeedback(true);
    const isCorrect = selectedIndex === correctAnswerIndex;

    // Update score
    setScore(
      (prevScore) => prevScore + (isCorrect ? POINTS_CORRECT : POINTS_INCORRECT)
    );

    // Add new score bonus animation instance
    const bonusId = scoreBonusIdCounter.current++;
    const newBonusInstance = {
      id: bonusId,
      type: isCorrect ? "correct" : "incorrect",
      points: isCorrect ? POINTS_CORRECT : POINTS_INCORRECT,
    };

    setScoreBonusInstances((prev) => [...prev, newBonusInstance]);

    // Remove this instance after animation completes
    setTimeout(() => {
      setScoreBonusInstances((prev) =>
        prev.filter((instance) => instance.id !== bonusId)
      );
    }, 2000);

    // Add 5 seconds to timer and show bonus animation if correct in timed mode
    if (isCorrect && gameMode === "timed") {
      setTimeLeft((prev) => prev + 5);
      setShowTimeBonus(true);
      setTimeout(() => setShowTimeBonus(false), 2000); // Hide after animation
    }

    // Show feedback
    setFeedbackType(isCorrect ? "correct" : "incorrect");
    setShowFeedback(true);

    // After animation, proceed to next image
    setTimeout(() => {
      setShowFeedback(false);
      setButtonsDisabled(false);
      setClickedButtonIndex(null);
      setShowButtonFeedback(false);
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

  const handleSkipClick = () => {
    // Only allow skip if buttons are not disabled and no feedback is showing
    if (!buttonsDisabled && !showFeedback && !gameOver) {
      proceedToNextImage();
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setScore(0);
    setShowFeedback(false);
    setButtonsDisabled(false);
    setGameOver(false);
    setGameStarted(false);
    setTimeLeft(TIMER_DURATION);
    setShowTimeBonus(false);
    // Trigger re-fetch by calling the effect again
    window.location.reload();
  };

  const handlePlayAgain = async () => {
    setScore(0);
    setShowFeedback(false);
    setButtonsDisabled(false);
    setGameOver(false);
    setGameStarted(false);
    setTimeLeft(TIMER_DURATION);
    setShowTimeBonus(false);
    setCurrentImageIndex(0);
    setShowLeaderboard(false);
    setIsNewHighScore(false);
    setScoreBonusInstances([]);

    // Re-shuffle the images to get a new random order
    if (allImages.length > 0) {
      const newlyShuffledImages = shuffleArray(allImages);
      setAllImages(newlyShuffledImages);

      // Preload the first image before showing the UI
      const firstImageData = newlyShuffledImages[0];
      await preloadImage(firstImageData.url);
      setCurrentImageData(firstImageData);

      const { options, correctIndex } = generateOptions(
        firstImageData.parkName,
        allParkNames
      );
      setCurrentOptions(options);
      setCorrectAnswerIndex(correctIndex);

      // Cache the first 10 images from the new order
      cacheImages(newlyShuffledImages, 1);

      // Restart timer if in timed mode
      if (gameMode === "timed") {
        setGameStarted(true);
      }
    }
  };

  const handleBackToMenu = () => {
    window.location.href = "#/";
  };

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const imageData = [];
        const parkNames = [];

        // Iterate directly over the cached data
        console.log("Starting to load albums...");
        console.log("Total albums to process:", Object.keys(cachedData).length);

        for (const [albumId, albumData] of Object.entries(cachedData)) {
          console.log(
            `Processing album: ${albumData.parkName} (ID: ${albumId})`
          );

          if (albumData && albumData.images && albumData.parkName) {
            console.log(
              `✅ Successfully loaded album: ${albumData.parkName} (${albumData.images.length} images)`
            );

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
          } else {
            console.log(
              `❌ Failed to load album: ${
                albumData.parkName || albumId
              } - missing data`
            );
          }
        }

        console.log(
          `Finished loading albums. Successfully loaded: ${parkNames.length} albums`
        );
        console.log("Loaded album names:", parkNames);
        console.log("Total images:", imageData.length);

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
      {/* Game Over Overlay */}
      {gameOver && (
        <div className={styles.gameOverOverlay}>
          <div className={styles.gameOverContent}>
            <div
              className={`${styles.flipContainer} ${
                showLeaderboard ? styles.flipped : ""
              }`}
            >
              {/* Front side - Final Score */}
              <div className={styles.gameOverFront}>
                <h2>Time's Up!</h2>
                <p>Final Score</p>
                <div className={styles.finalScore}>
                  {score >= 0
                    ? score.toString().padStart(4, "0")
                    : `-${Math.abs(score).toString().padStart(4, "0")}`}
                </div>
              </div>

              {/* Back side - Leaderboard */}
              <div className={styles.gameOverBack}>
                {/* Final score on leaderboard side */}
                <div className={styles.leaderboardFinalScore}>
                  Final Score:{" "}
                  {score >= 0
                    ? score.toString().padStart(4, "0")
                    : `-${Math.abs(score).toString().padStart(4, "0")}`}
                </div>

                {/* New High Score banner */}
                {isNewHighScore && (
                  <div className={styles.newHighScoreBanner}>
                    ⭐ New High Score! ⭐
                  </div>
                )}

                {/* Buttons on leaderboard side */}
                <div className={styles.gameOverButtons}>
                  <button
                    onClick={handlePlayAgain}
                    className={styles.playAgainButton}
                  >
                    Play Again
                  </button>
                  <button
                    onClick={handleBackToMenu}
                    className={styles.backToMenuButton}
                  >
                    Back to Menu
                  </button>
                </div>

                <h2>Leaderboard</h2>
                <div className={styles.leaderboardContent}>
                  <div className={styles.leaderboardTable}>
                    {LEADERBOARD_CATEGORIES.map((category, index) => {
                      const userCategory = getUserCategory(score);
                      const isUserCategory =
                        category.threshold === userCategory.threshold ||
                        (score < -1000 && category.threshold === -1000);

                      return (
                        <div
                          key={index}
                          className={`${styles.leaderboardRow} ${
                            isUserCategory ? styles.userRow : ""
                          }`}
                        >
                          <div className={styles.leaderboardThreshold}>
                            {category.threshold}
                          </div>
                          <div className={styles.leaderboardCategory}>
                            {`${category.emoji}  ${category.name}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.mainContainer}>
        {/* Score display in top left */}
        <div className={styles.scoreDisplay}>
          {score >= 0
            ? score.toString().padStart(4, "0")
            : `-${Math.abs(score).toString().padStart(4, "0")}`}
        </div>

        {/* Timer display in top right for timed mode */}
        {gameMode === "timed" && (
          <div className={styles.timerDisplay}>
            {timeLeft.toString().padStart(2, "0")}
          </div>
        )}

        {/* Time bonus animation */}
        {showTimeBonus && (
          <div
            style={{ animationIterationCount: "infinite" }}
            className={styles.timeBonusDisplay}
          >
            +5
          </div>
        )}

        {/* Score bonus animations */}
        {scoreBonusInstances.map((instance, index) => (
          <div
            key={instance.id}
            className={`${styles.scoreBonusDisplay} ${styles[instance.type]}`}
            style={{
              top: `${30 + index * 10}px`, // Stagger vertically
              left: `${140 + index * 5}px`, // Stagger horizontally slightly
              animationDelay: `${index * 0.1}s`, // Slight delay between animations
            }}
          >
            {instance.points > 0 ? `+${instance.points}` : instance.points}
          </div>
        ))}
        <div className={styles.imageSection}>
          <div className={styles.imageContainer}>
            <img
              src={currentImageData?.url}
              alt="National Park"
              className={styles.galleryImage}
            />

            {/* Skip button floating on image */}
            <button
              className={`${styles.skipButton} ${
                buttonsDisabled || showFeedback || gameOver
                  ? styles.disabled
                  : ""
              }`}
              onClick={handleSkipClick}
              disabled={buttonsDisabled || showFeedback || gameOver}
            >
              Skip
            </button>

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
            {currentOptions.map((option, index) => {
              let buttonClass = styles.menuButton;

              if (showButtonFeedback) {
                if (index === correctAnswerIndex) {
                  buttonClass += ` ${styles.correct}`;
                } else if (index === clickedButtonIndex) {
                  buttonClass += ` ${styles.incorrect}`;
                }
              } else if (index === clickedButtonIndex) {
                buttonClass += ` ${styles.clicked}`;
              }

              if (gameOver) {
                buttonClass += ` ${styles.disabled}`;
              }

              return (
                <button
                  key={index}
                  className={buttonClass}
                  onClick={() => handleButtonClick(index)}
                  disabled={buttonsDisabled || gameOver}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
