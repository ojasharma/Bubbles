// app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import VercelAnalytics from "@/components/VercelAnalytics"; 

export const metadata = {
  title: "Bubbles",
  description: "Note Taking App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <VercelAnalytics /> 
        </body>
      </html>
    </ClerkProvider>
  );
}
