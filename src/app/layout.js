// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"; 

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
          <Analytics /> 
        </body>
      </html>
    </ClerkProvider>
  );
}
