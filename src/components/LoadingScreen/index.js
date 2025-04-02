
// src/components/LoadingScreen/index.js
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <div className={styles.loadingOverlay}>
      {/* Optional: Content inside the blurred overlay */}
      <div className={styles.loadingContent}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading Scene...</p>
      </div>
    </div>
  );
}