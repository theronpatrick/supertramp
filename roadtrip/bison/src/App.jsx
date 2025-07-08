import { useState, useEffect, useRef } from "preact/hooks";
import albums from "./data/albums.js";

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

      setAllImages(shuffledImages);
      setCurrentImage(shuffledImages[0]);

      // Preload first 10 images for smooth experience
      const imagesToPreload = shuffledImages.slice(0, 10).map((img) => img.url);
      preloadImages(imagesToPreload);
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
      <div
        className="app"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            animation: "spin 2s linear infinite",
          }}
        >
          🦬
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center", color: "red" }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchAllImages}>Retry</button>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div
        className="app"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>No images available</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          onClick={handleImageClick}
          style={{
            cursor: "pointer",
            maxWidth: "90vw",
            maxHeight: "70vh",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          <img
            src={currentImage.url}
            alt={currentImage.title}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </main>
    </div>
  );
}
