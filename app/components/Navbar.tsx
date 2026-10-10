"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// অটোমেটিক বাংলা তারিখ বানানোর ফাংশন
const getBengaliDate = () => {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBnNum = (num: number) => num.toString().split('').map(d => bnDigits[parseInt(d)] || d).join('');

  const d = new Date();
  return `${days[d.getDay()]}, ${toBnNum(d.getDate())} ${months[d.getMonth()]}, ${toBnNum(d.getFullYear())}`;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("ইউজার");
  const [todayDate, setTodayDate] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
    setTodayDate(getBengaliDate()); // প্রতিদিন অটো চেঞ্জ হবে
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    toast.success("সফলভাবে সাইন আউট হয়েছেন!");
    router.push("/signin");
    setTimeout(() => window.location.reload(), 500);
  };

  const links = [
    { name: "চাল", path: "/category/chal", icon: "🍚" },
    { name: "ডাল", path: "/category/dal", icon: "🫘" },
    { name: "তেল", path: "/category/tel", icon: "🛢️" },
    { name: "সবজি", path: "/category/sobji", icon: "🥬" },
    { name: "মাছ", path: "/category/mach", icon: "🐟" },
    { name: "মাংস", path: "/category/mangsho", icon: "🥩" },
    { name: "ডিম-দুধ", path: "/category/dim-dudh", icon: "🥚" },
    { name: "মসলা", path: "/category/mosla", icon: "🧅" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* প্রথম লাইন: লোগো, ডাইনামিক তারিখ এবং প্রোফাইল */}
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-green-700 text-white p-2 rounded-xl text-2xl shadow-sm">🛒</div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-xl leading-none">বাজার দর</span>
              <span className="text-[11px] text-gray-500 mt-1 font-medium">{todayDate || "লোড হচ্ছে..."}</span>
            </div>
          </Link>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
              <div className="w-7 h-7 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold uppercase">{userName.charAt(0)}</div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[120px]">{userName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-56 mt-2 border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100 mb-2 bg-gray-50 rounded-t-box">
                <p className="font-bold text-sm text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">user@bazardor.com</p>
              </div>
              <li><Link href="/profile" className="text-gray-700 hover:text-green-600 font-medium py-2">👤 আমার প্রোফাইল</Link></li>
              <li><button onClick={handleLogout} className="text-red-500 hover:bg-red-50 hover:text-red-600 font-medium py-2 mt-1">🚪 সাইন আউট</button></li>
            </ul>
          </div>
        </div>

        {/* দ্বিতীয় লাইন: ক্যাটাগরি মেনু (justify-start করে বামে চাপিয়ে দেওয়া হলো) */}
        <div className="flex justify-start items-center overflow-x-auto py-1 scrollbar-hide">
          <ul className="flex items-center gap-6 text-sm whitespace-nowrap pb-2">
            {links.map((link, idx) => (
              <li key={idx}>
                <Link href={link.path} className={`flex items-center gap-1.5 pb-2 border-b-[3px] transition-all ${pathname === link.path ? "border-green-600 text-green-700 font-bold" : "border-transparent text-gray-500 hover:text-green-600 hover:border-green-200"}`}>
                  <span className="text-lg opacity-80">{link.icon}</span> {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </div>
  );
}