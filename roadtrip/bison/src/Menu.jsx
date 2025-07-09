import { useState, useEffect } from "preact/hooks";
import { Link } from "react-router-dom";
import logoImg from "./assets/logo.png";
import styles from "./Menu.module.less";

export function Menu() {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Show overlay after 1 second
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstructionsClick = () => {
    // TODO: Implement instructions
    console.log("Instructions clicked");
  };

  return (
    <div className={styles.menu}>
      <div className={styles.menuBackground}>
        <img
          src={logoImg}
          alt="Bison Brawl Logo"
          className={styles.logoBackground}
        />
      </div>

      <div
        className={`${styles.menuOverlay} ${showOverlay ? styles.visible : ""}`}
      >
        <div className={styles.container}>
          <div className={styles.buttons}>
            <Link
              to="/game?mode=timed"
              className={`${styles.button} ${styles.startButton}`}
            >
              START
            </Link>
            <Link
              to="/game?mode=timeless"
              className={`${styles.button} ${styles.timelessButton}`}
            >
              TIMELESS
            </Link>
            <button
              className={`${styles.button} ${styles.instructionsButton}`}
              onClick={handleInstructionsClick}
            >
              INSTRUCTIONS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
