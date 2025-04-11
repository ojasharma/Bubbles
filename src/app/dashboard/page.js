"use client";

import { useEffect, useRef } from "react";

export default function Page() {
  const tweetRef = useRef(null);

  useEffect(() => {
    // Add the Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);

    // Add the blockquote dynamically
    if (tweetRef.current) {
      tweetRef.current.innerHTML = `
        <blockquote class="twitter-tweet">
          <p lang="en" dir="ltr">
            I love Notion, but I want more. A new design language for note-taking, AI that nudges me to revisit notes, a clearer vision of everything I write, and visual roadmaps & habit tracking. Rethinking the norm with BUBBLES—let’s build! 🚀Starting today
            <a href="https://twitter.com/hashtag/buildinpublic?src=hash">#buildinpublic</a>
          </p>
          &mdash; Ojasvi Sharma (@DieselSharma)
          <a href="https://twitter.com/DieselSharma/status/1901884855346135066">March 18, 2025</a>
        </blockquote>
      `;
    }
  }, []);

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
        position: "relative",
        overflow: "auto",
      }}
    >
      <div style={{ zIndex: 1 }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💬 Bubbles</h1>
        <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
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
        <p style={{ fontSize: "1rem" }}>
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
        <p style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
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

        {/* Actual Tweet Embed */}
        <div ref={tweetRef} style={{ marginTop: "2rem" }}></div>
      </div>
    </div>
  );
}
