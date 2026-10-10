import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import PriceTicker from "./components/PriceTicker";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Bazar Dor | বাজার দর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" data-theme="light" className="scroll-smooth">
      <body className="bg-white min-h-screen flex flex-col font-sans">
        
        {/* ন্যাভবার এবং স্ক্রলিং প্রাইস টিকার */}
        <Navbar />
        <PriceTicker />
        
        {/* মেইন কন্টেন্ট */}
        <div className="flex-grow">
          {children}
        </div>

        {/* অ্যাসাইনমেন্টের রিকোয়ারমেন্ট অনুযায়ী ফুটার */}
        <footer className="footer bg-orange-50 border-t border-orange-100 text-gray-600 py-6 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center mt-auto">
          <aside className="text-center md:text-left">
            <p className="font-bold text-lg text-gray-800">বাজার দর <span className="text-sm font-normal text-gray-500">— প্রয়োজনীয় পণ্যের দাম এক নজরে।</span></p>
          </aside>
          <nav className="text-center md:text-right mt-2 md:mt-0">
            <p className="text-sm text-gray-500">সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
          </nav>
        </footer>

        {/* সাকসেস বা এরর মেসেজ দেখানোর জন্য Toaster */}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}