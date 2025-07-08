import { useState, useEffect, useRef } from "preact/hooks";
import albums from "./data/albums.js";
import "./App.less";

export function App() {
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageCacheRef = useRef(new Set());

  console.log("version 25.7.8l");

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Preload images for caching
  const preloadImages = (imageUrls) => {
    imageUrls.forEach((url) => {
      if (!imageCacheRef.current.has(url)) {
        const img = new Image();
        img.onload = () => {
          imageCacheRef.current.add(url);
          console.log(`Cached image: ${url.split("/").pop()}`);
        };
        img.src = url;
      }
    });
  };

  // Preload single image and return promise
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      if (imageCacheRef.current.has(url)) {
        resolve(url);
        return;
      }

      const img = new Image();
      img.onload = () => {
        imageCacheRef.current.add(url);
        console.log(`First image loaded: ${url.split("/").pop()}`);
        resolve(url);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      img.src = url;
    });
  };

  // Fetch all images from all albums
  const fetchAllImages = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching all albums...");

      // Fetch all albums concurrently
      const albumPromises = Object.entries(albums).map(
        async ([parkName, albumData]) => {
          try {
            const response = await fetch(
              `https://api.imgur.com/3/album/${albumData.url}`,
              {
                headers: {
                  authorization: "Client-ID 27a13f9320a8875",
                },
              }
            );

            if (!response.ok) {
              console.warn(
                `Failed to fetch album for ${parkName}: ${response.status}`
              );
              return [];
            }

            const data = await response.json();
            const images = data.data.images || [];

            // Return images with park context
            return images.map((img) => ({
              url: img.link,
              title: img.title || img.description || `${parkName} Image`,
              parkName: parkName,
              id: img.id,
            }));
          } catch (err) {
            console.warn(`Error fetching album for ${parkName}:`, err);
            return [];
          }
        }
      );

      const albumResults = await Promise.all(albumPromises);

      // Flatten all images into single array and shuffle
      const allImagesArray = albumResults.flat();
      const shuffledImages = shuffleArray(allImagesArray);

      console.log(
        `Loaded ${shuffledImages.length} total images from ${
          Object.keys(albums).length
        } parks`
      );

      if (shuffledImages.length === 0) {
        setError("No images found");
        return;
      }

      setAllImages(shuffledImages);
      setCurrentImage(shuffledImages[0]);

      // Wait for first image to load before showing UI
      await preloadImage(shuffledImages[0].url);

      // Preload remaining 9 images in background (don't await this)
      const remainingImagesToPreload = shuffledImages
        .slice(1, 10)
        .map((img) => img.url);
      preloadImages(remainingImagesToPreload);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image click - go to next image
  const handleImageClick = () => {
    if (allImages.length === 0) return;

    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setCurrentImage(allImages[nextIndex]);

    // Preload next batch of images
    const startPreload = nextIndex + 1;
    const endPreload = Math.min(startPreload + 10, allImages.length);
    const imagesToPreload = allImages
      .slice(startPreload, endPreload)
      .map((img) => img.url);
    preloadImages(imagesToPreload);

    console.log(
      `Showing image ${nextIndex + 1} of ${allImages.length}: ${
        allImages[nextIndex].parkName
      }`
    );
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  if (loading) {
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
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={fetchAllImages}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="app">
        <div className="no-images-container">
          <div className="no-images-content">
            <h2>No images available</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="main-container">
        <div className="image-section">
          <div className="image-container" onClick={handleImageClick}>
            <img
              src={currentImage.url}
              alt={currentImage.title}
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
      </main>
    </div>
  );
}
