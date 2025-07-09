import { useState, useEffect, useRef } from "preact/hooks";
import albums from "./data/albums";
import cachedData from "./data/api/cache.25.7.8";
import "./App.less";

console.log("Version 25.7.8.n");

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

    // Put correct answer at index 0 for now, then add 3 incorrect ones
    return [correctParkName, ...selectedIncorrect];
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

  const handleImageClick = () => {
    if (currentImageIndex < allImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      const nextImageData = allImages[nextIndex];

      setCurrentImageIndex(nextIndex);
      setCurrentImageData(nextImageData);
      setCurrentOptions(generateOptions(nextImageData.parkName, allParkNames));

      // Cache next 10 images
      cacheImages(allImages, nextIndex + 1);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
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
          setCurrentOptions(
            generateOptions(firstImageData.parkName, parkNames)
          );

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
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner">🦬</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <div className="error-content">
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
      <div className="app">
        <div className="no-images-container">
          <div className="no-images-content">
            <h2>No images found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="main-container">
        <div className="image-section">
          <div className="image-container" onClick={handleImageClick}>
            <img
              src={currentImageData?.url}
              alt="National Park"
              className="gallery-image"
            />
          </div>
        </div>

        <div className="game-menu">
          <div className="menu-buttons">
            {currentOptions.map((option, index) => (
              <button key={index} className="menu-button">
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
