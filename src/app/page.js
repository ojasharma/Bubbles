import styles from "./page.module.css";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene/index"), {
  ssr: false,
});

const MouseFollower = dynamic(() => import("@/components/MouseFollower"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className={styles.main}>
      <MouseFollower />
      <div className={styles.scene}>
        <Scene />
      </div>
    </main>
  );
}
