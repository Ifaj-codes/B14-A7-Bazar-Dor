"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // ইউজারের নাম হিসেবে ডেমো একটা নাম সেভ করে দিচ্ছি অ্যাসাইনমেন্টের জন্য
    localStorage.setItem("bazar_user", JSON.stringify({ name: "Ifaj Hossain", email }));
    router.push("/"); // লগইন শেষে হোমপেজে চলে যাবে
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">সাইন ইন</h2>
        <p className="text-sm text-gray-500 mb-8">বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।</p>
        
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="text-left">
             <label className="text-xs text-gray-500 mb-1 block">ইমেইল</label>
             <input type="email" placeholder="example@gmail.com" required className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-blue-50/30 text-sm" onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="text-left mb-2">
             <label className="text-xs text-gray-500 mb-1 block">পাসওয়ার্ড</label>
             <input type="password" placeholder="••••••••" required className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-blue-50/30 text-sm" onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition-colors">সাইন ইন</button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
           অ্যাকাউন্ট নেই? <Link href="/signup" className="text-green-600 font-bold hover:underline">সাইন আপ করুন</Link>
        </div>
      </div>
    </div>
  );
}