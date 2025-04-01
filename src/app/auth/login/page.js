import styles from "./page.module.css";
import Image from "next/image";
import VerticalLetters from "@/components/VerticalLetters/VerticalLetters";
import SignIn from "@/components/signin/SignIn"; // Adjust the path as needed

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Vertical Letters Component (on top) */}
      <div className={styles.lettersOverlay}>
        <VerticalLetters
          letters={["B", "U", "B", "B", "L", "E", "S"]}
          direction={1} 
        />
      </div>

      {/* Rotating Logo (background) */}
      <div className={styles.logoContainer}>
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          className={styles.logo}
          priority
        />
      </div>

      {/* SignIn Component */}
      <SignIn />
    </div>
  );
}