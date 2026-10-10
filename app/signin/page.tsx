"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const namePart = email.split("@")[0] || "ইউজার";
    localStorage.setItem("userName", namePart); // লগিন ইমেইলের প্রথম অংশ নাম হিসেবে সেভ হবে
    
    toast.success("সফলভাবে লগিন হয়েছে!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4 bg-gray-50/30">
      <div className="card w-full max-w-md bg-white shadow-xl border border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">সাইন ইন করুন</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="label"><span className="label-text font-bold text-gray-600">ইমেইল ঠিকানা</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="input input-bordered w-full focus:border-green-600 focus:outline-none" required />
          </div>
          <div>
            <label className="label"><span className="label-text font-bold text-gray-600">পাসওয়ার্ড</span></label>
            <input type="password" placeholder="••••••••" className="input input-bordered w-full focus:border-green-600 focus:outline-none" required />
          </div>
          <button type="submit" className="btn bg-green-700 hover:bg-green-800 text-white w-full mt-4 border-none text-lg">লগিন</button>
        </form>
        
        <div className="divider my-6 text-gray-400">অথবা</div>
        
        <div className="flex flex-col gap-3">
          <button onClick={() => toast.success("Google দিয়ে লগিন সফল!")} className="btn btn-outline border-gray-300 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 w-full">Google দিয়ে লগিন</button>
          <button onClick={() => toast.success("GitHub দিয়ে লগিন সফল!")} className="btn bg-gray-900 hover:bg-gray-800 text-white w-full border-none">GitHub দিয়ে লগিন</button>
        </div>
        
        <p className="text-center text-sm text-gray-600 mt-8">
          অ্যাকাউন্ট নেই? <Link href="/signup" className="text-green-600 font-bold hover:underline">সাইন আপ করুন</Link>
        </p>
      </div>
    </div>
  );
}