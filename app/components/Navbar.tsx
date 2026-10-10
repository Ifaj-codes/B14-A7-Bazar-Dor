"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("ইউজার");

  useEffect(() => {
    const storedUser = localStorage.getItem("bazar_user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj?.name) setUserName(userObj.name);
      } catch (e) {
        setUserName("ইউজার");
      }
    }
  }, []);

  return (
    <div className="navbar bg-white border-b border-gray-100 px-4 md:px-8 sticky top-0 z-50">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold text-green-600 flex items-center gap-2">
          <span>🛒</span> বাজার দর
        </Link>
      </div>
      <div className="flex-none gap-3">
        <Link href="/" className={`btn btn-sm btn-ghost ${pathname === '/' ? 'text-green-600 font-bold' : ''}`}>
          হোম
        </Link>
        <Link href="/profile" className="btn btn-sm bg-green-600 text-white hover:bg-green-700">
          প্রোফাইল
        </Link>
      </div>
    </div>
  );
}