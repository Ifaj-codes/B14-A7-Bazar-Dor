"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getBanglaDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('bn-BD', options);
    const enToBn = (str: string) => {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return str.replace(/\d/g, d => bnDigits[parseInt(d)]);
    };
    return enToBn(formattedDate);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("bazar_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name);
      setUserEmail(parsedUser.email || "user@example.com");
    }
    setIsDropdownOpen(false); 
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("bazar_user");
    setUserName(null);
    setUserEmail(null);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const categories = [
    { name: "চাল", slug: "chal", emoji: "🍚" },
    { name: "ডাল", slug: "dal", emoji: "🥣" },
    { name: "তেল", slug: "tel", emoji: "🛢️" },
    { name: "সবজি", slug: "sobji", emoji: "🥬" },
    { name: "মাছ", slug: "mach", emoji: "🐟" },
    { name: "মাংস", slug: "mangsho", emoji: "🥩" },
    { name: "ডিম-দুধ", slug: "dim-dudh", emoji: "🥚" },
    { name: "মসলা", slug: "mosholla", emoji: "🌶️" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm w-full">
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-lg text-xl">🛒</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">বাজার দর</h1>
              <p className="text-[11px] md:text-xs text-gray-500 font-medium">{getBanglaDate()}</p>
            </div>
          </Link>
          
          <div className="z-50">
            {userName ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 bg-gray-50 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate max-w-[100px] md:max-w-[150px]">{userName}</span>
                  <span className="text-gray-400 text-[10px]">▼</span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-800 truncate">{userName}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 font-medium transition" onClick={() => setIsDropdownOpen(false)}>
                      👤 আমার প্রোফাইল
                    </Link>
                    <button onClick={handleSignOut} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-medium transition">
                      ⎋ সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signin" className="text-sm font-bold text-gray-700 hover:text-green-600 hidden md:block">সাইন ইন</Link>
                <Link href="/signup" className="text-sm font-bold bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">সাইন আপ</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-b border-gray-100 py-3 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-6 md:gap-8 justify-start text-[13px] md:text-sm font-bold text-gray-600 min-w-max">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/category/${cat.slug}`}
              className={`flex items-center gap-1.5 hover:text-green-600 transition ${pathname.includes(cat.slug) ? 'text-green-600 border-b-2 border-green-600 pb-1' : ''}`}
            >
              <span className="text-lg">{cat.emoji}</span> {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-[#fff8f1] border-b border-orange-100 flex items-center text-[13px] overflow-hidden w-full relative">
         <style dangerouslySetInnerHTML={{__html: `
           @keyframes continuous-ticker {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
           }
           .ticker-wrapper {
             display: flex;
             width: max-content;
             animation: continuous-ticker 25s linear infinite;
           }
           .ticker-wrapper:hover {
             animation-play-state: paused;
           }
         `}} />
         
         <div className="bg-orange-500 text-white px-4 md:px-5 py-2 font-bold shrink-0 z-10 flex items-center gap-2 relative shadow-[5px_0_10px_rgba(0,0,0,0.05)]">
           <span className="animate-pulse">🔥</span> আজকের বাজার
         </div>
         
         <div className="flex-1 overflow-hidden flex items-center h-full ml-4">
             <div className="ticker-wrapper flex gap-10 text-gray-700 font-medium py-1">
                 <div className="flex gap-10 shrink-0 pr-10">
                    <span>মিনিকেট চাল: ৭২ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ১.২%</span></span>
                    <span>সোনালী মুরগি: ২৭০ টাকা/কেজি <span className="text-green-600 font-bold ml-1">▼ ২.০%</span></span>
                    <span>খাসির মাংস: ৭২০ টাকা/কেজি <span className="text-gray-400 font-bold ml-1">— ০.০%</span></span>
                    <span>গরুর মাংস: ৭২০ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ২.১%</span></span>
                    <span>ডিম: ১৫০ টাকা/ডজন <span className="text-gray-400 font-bold ml-1">— ০.০%</span></span>
                    <span>কাঁচা মরিচ: ১৬০ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ৫.০%</span></span>
                    <span>পেঁয়াজ: ৫৫ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ২.০%</span></span>
                 </div>
                 <div className="flex gap-10 shrink-0 pr-10">
                    <span>মিনিকেট চাল: ৭২ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ১.২%</span></span>
                    <span>সোনালী মুরগি: ২৭০ টাকা/কেজি <span className="text-green-600 font-bold ml-1">▼ ২.০%</span></span>
                    <span>খাসির মাংস: ৭২০ টাকা/কেজি <span className="text-gray-400 font-bold ml-1">— ০.০%</span></span>
                    <span>গরুর মাংস: ৭২০ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ২.১%</span></span>
                    <span>ডিম: ১৫০ টাকা/ডজন <span className="text-gray-400 font-bold ml-1">— ০.০%</span></span>
                    <span>কাঁচা মরিচ: ১৬০ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ৫.০%</span></span>
                    <span>পেঁয়াজ: ৫৫ টাকা/কেজি <span className="text-red-500 font-bold ml-1">▲ ২.০%</span></span>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}
