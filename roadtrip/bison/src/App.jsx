import { useState, useEffect } from "preact/hooks";
import albums from "./data/albums.js";

export function App() {
  const [count, setCount] = useState(0);
  const [albumImages, setAlbumImages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("version 25.7.8l");

  const fetchAlbumImage = async (albumId) => {
    try {
      const response = await fetch(`https://api.imgur.com/3/album/${albumId}`, {
        headers: {
          authorization: "Client-ID 27a13f9320a8875",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const images = data.data.images || [];
      return images.length > 0 ? images[0].link : null;
    } catch (err) {
      console.error(`Error fetching album ${albumId}:`, err);
      return null;
    }
  };

  const fetchAllAlbumImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const imagePromises = Object.entries(albums).map(
        async ([parkName, albumData]) => {
          const firstImageUrl = await fetchAlbumImage(albumData.url);
          return [parkName, firstImageUrl];
        }
      );

      const results = await Promise.all(imagePromises);
      const imageMap = Object.fromEntries(results);
      setAlbumImages(imageMap);
      console.log("Album images fetched:", imageMap);
    } catch (err) {
      console.error("Error fetching album images:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAlbumImages();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🦬 Bison </h1>
        <p>Welcome to the Bison section of theron.dev</p>
        <p>v 25.7.8l</p>
        <button
          className="counter-btn"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <p className="read-the-docs">
          Ready to build something awesome with Preact!
        </p>
      </header>

      <main>
        <h2>National Parks Gallery</h2>

        {loading && <p>Loading album images...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {!loading && !error && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "left",
                  }}
                >
                  Park Name
                </th>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    textAlign: "left",
                  }}
                >
                  First Image
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(albums).map(([parkName, albumData]) => (
                <tr key={parkName}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "12px",
                      verticalAlign: "top",
                    }}
                  >
                    {parkName}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                    {albumImages[parkName] ? (
                      <img
                        src={albumImages[parkName]}
                        alt={`First image from ${parkName}`}
                        style={{
                          maxWidth: "300px",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span>Loading...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
