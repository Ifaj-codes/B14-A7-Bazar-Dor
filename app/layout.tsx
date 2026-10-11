import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Bazar Dor",
  description: "Bazar Dor Update",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="bg-white text-gray-900 font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}