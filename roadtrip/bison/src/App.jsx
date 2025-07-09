import { useState, useEffect, useRef } from "preact/hooks";
import albums from "./data/albums";
import cachedData from "./data/api/cache.25.7.8";
import "./App.less";

const loadAlbumData = async (albumId) => {
  const cachedAlbum = cachedData[albumId];
  if (cachedAlbum && cachedAlbum.success) {
    return cachedAlbum.data;
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
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const cacheImages = async (images, startIndex) => {
    const cachePromises = [];
    for (let i = 0; i < 10 && startIndex + i < images.length; i++) {
      const url = images[startIndex + i];
      if (!imageCache.current.has(url)) {
        cachePromises.push(preloadImage(url));
      }
    }

    const cachedUrls = await Promise.all(cachePromises);
    cachedUrls.forEach((url) => imageCache.current.set(url, true));
  };

  const handleImageClick = () => {
    if (currentImageIndex < allImages.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setCurrentImageUrl(allImages[nextIndex]);

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
        const imageUrls = [];

        // Convert albums object to array of entries and iterate
        for (const [parkName, albumInfo] of Object.entries(albums)) {
          const albumData = await loadAlbumData(albumInfo.url);
          if (albumData && albumData.images) {
            albumData.images.forEach((img) => {
              imageUrls.push(img.link);
            });
          }
        }

        if (imageUrls.length > 0) {
          const shuffledImages = shuffleArray(imageUrls);
          setAllImages(shuffledImages);

          // Preload the first image before showing the UI
          const firstImageUrl = shuffledImages[0];
          await preloadImage(firstImageUrl);
          setCurrentImageUrl(firstImageUrl);
          setCurrentImageIndex(0);

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
              src={currentImageUrl}
              alt="National Park"
              className="gallery-image"
            />
          </div>
        </div>

        <div className="game-menu">
          <div className="menu-buttons">
            <button className="menu-button">First</button>
            <button className="menu-button">Second</button>
            <button className="menu-button">Third</button>
            <button className="menu-button">Fourth</button>
          </div>
        </div>
      </div>
    </div>
  );
}
