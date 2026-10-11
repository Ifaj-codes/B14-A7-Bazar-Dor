"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [newName, setNewName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("bazar_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNewName(parsedUser.name);
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("bazar_user");
    router.push("/");
  };

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newName.trim()) {
      const updatedUser = { ...user, name: newName };
      localStorage.setItem("bazar_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // ডেমোর মতো সবুজ সাকসেস মেসেজ দেখানো
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // নাম আপডেট হওয়ার পর Navbar আপডেট করার জন্য ইভেন্ট ডিসপ্যাচ করা (যাতে রিলোড না লাগে)
      window.dispatchEvent(new Event("storage")); 
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 min-h-[70vh] relative">
      
      {/* সাকসেস মেসেজ টোস্ট (ডেমোর মতো) */}
      {showSuccessMessage && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-50 border border-green-200 text-green-700 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm animate-fade-in-down z-50">
          <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">✓</span> 
          নাম সফলভাবে হালনাগাদ হয়েছে!
        </div>
      )}

      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">আমার প্রোফাইল</h1>
        <p className="text-sm text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleSignOut}
          className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2"
        >
          <span className="text-lg leading-none">⎋</span> সাইন আউট
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">নাম হালনাগাদ করুন</h3>
        <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">নাম</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500 bg-gray-50/50"
              required
            />
          </div>
          <button 
            type="submit"
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition self-start"
          >
            নাম হালনাগাদ করুন
          </button>
        </form>
      </div>
    </div>
  );
}