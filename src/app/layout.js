import './globals.css'
import { TransitionProvider } from "./context/transition-context";

export const metadata = {
  title: 'Bubbles',
  description: 'Note Taking App',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <TransitionProvider>{children}</TransitionProvider>
      </body>
    </html>
  );
}