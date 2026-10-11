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
      <body className="bg-white text-gray-900 font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <footer className="border-t border-gray-100 bg-white py-6 mt-10">
          <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] md:text-sm text-gray-500 font-medium">
            <p>বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
            <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
          </div>
        </footer>
      </body>
    </html>
  );
}