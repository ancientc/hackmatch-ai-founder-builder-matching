import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HackMatch",
  description: "Meet the right person. Right now.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
