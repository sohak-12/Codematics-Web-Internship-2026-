import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preplyx — AI Interview Preparation Platform",
  description: "Get interview-ready with AI-powered practice & feedback.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        {/* Particles — deterministic positions to avoid hydration mismatch */}
        <div className="particles-bg" aria-hidden>
          {[3,7,12,18,23,28,33,38,43,48,53,58,63,68,73,78,83,88,93,97,5,15,25,35,45,55,65,75,85,95].map((x, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${x}%`,
                animationDelay: `${(i * 0.67) % 20}s`,
                animationDuration: `${15 + (i % 6) * 3}s`,
              }}
            />
          ))}
        </div>
        <Navbar />
        <div className="relative z-10">{children}</div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
