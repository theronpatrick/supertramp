import { useState, useEffect } from "preact/hooks";
import { Link } from "react-router-dom";
import logoImg from "./assets/logo.png";
import styles from "./Menu.module.less";

export function Menu() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Show overlay after 1 second
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInstructionsClick = () => {
    setShowInstructions(true);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowInstructions(false);
    }
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

      {/* Instructions Modal */}
      {showInstructions && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>HOW TO PLAY</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseInstructions}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <p className={styles.instructionText}>
                Each picture is from a <strong>National Park</strong>, and
                you'll have 4 possible parks to choose from.
              </p>
              <p className={styles.instructionText}>
                Click the button to guess which park it is!
              </p>
              <div className={styles.scoringSection}>
                <h3 className={styles.sectionTitle}>SCORING</h3>
                <ul className={styles.scoreList}>
                  <li>
                    Correct answers: <strong>+100 points</strong>
                  </li>
                  <li>
                    Incorrect guesses: <strong>-50 points</strong>
                  </li>
                  <li>Skip if you want (no penalty)</li>
                </ul>
              </div>
              <div className={styles.modesSection}>
                <h3 className={styles.sectionTitle}>GAME MODES</h3>
                <div className={styles.modeInfo}>
                  <strong>TIMED:</strong> Start with 30 seconds on the clock.
                  Get +5 seconds for each correct answer!
                </div>
                <div className={styles.modeInfo}>
                  <strong>TIMELESS:</strong> Go for however long you want - no
                  time pressure!
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.gameButton}
                onClick={handleCloseInstructions}
              >
                GOT IT!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
