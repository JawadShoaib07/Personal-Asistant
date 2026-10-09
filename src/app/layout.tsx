import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Assistant — Intelligent AI Workspace",
  description: "Next-generation personal AI assistant powered by advanced neural reasoning, voice interaction, code generation, and 1 Billion token memory capacity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="min-h-screen bg-[#08080a] text-[#fcfaf6] antialiased selection:bg-[#d4af37] selection:text-black font-sans"
      >
        {children}
      </body>
    </html>
  );
}
