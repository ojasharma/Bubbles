import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.loginText}>
          Login To <span className={styles.bubblesText}>Bubbles</span>
        </h1>
      </div>
      <div className={styles.logoContainer}>
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          className={styles.logo}
          priority
        />
      </div>
    </div>
  );
}
