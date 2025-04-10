export default function Page() {
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #2c003e, #5f0a87)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, sans-serif",
        color: "#e0d7ff",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
        }}
      >
        💬 Bubbles
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          marginBottom: "0.5rem",
        }}
      >
        Thank you for visiting my build in public website!
      </p>
      <p
        style={{
          fontSize: "1rem",
          marginBottom: "2rem",
          fontStyle: "italic",
          color: "#d1b3ff",
        }}
      >
        🚧 Work In Progress 🚧
      </p>
      <p
        style={{
          fontSize: "1rem",
        }}
      >
        Made with <span style={{ color: "#ff4da6" }}>❤️</span> by{" "}
        <a
          href="https://x.com/dieselsharma"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#b891ff", textDecoration: "none" }}
        >
          @dieselsharma
        </a>
      </p>
      <p
        style={{
          fontSize: "1rem",
          marginTop: "0.5rem",
        }}
      >
        🛠️ GitHub repo:{" "}
        <a
          href="https://github.com/ojasharma/Bubbles"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#b891ff", textDecoration: "none" }}
        >
          ojasharma/Bubbles
        </a>
      </p>
    </div>
  );
}
