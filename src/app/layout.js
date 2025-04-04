import "./globals.css";
import { TransitionProvider } from "./context/transition-context";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Bubbles",
  description: "Note Taking App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }}>
          <TransitionProvider>{children}</TransitionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
