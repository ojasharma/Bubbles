// src/app/page2/page.js
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page2() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#e0e0e0",
        gap: "20px",
      }}
    >
      <h1>Page 2 Content</h1>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Back to Page 1
      </Link>
    </motion.div>
  );
}
