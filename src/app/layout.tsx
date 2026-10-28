import type { Metadata, Viewport } from "next";
import "@fontsource/big-shoulders-display/600";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/newsreader/400";
import "@fontsource/newsreader/400-italic";
import "@fontsource/newsreader/500";
import "@fontsource/jetbrains-mono/400";
import "./globals.css";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.summary,
  openGraph: { title: site.name, description: site.summary, type: "website" },
};

export const viewport: Viewport = { themeColor: "#0c0b09", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets CSS hide intro elements only when JS will animate them in. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
