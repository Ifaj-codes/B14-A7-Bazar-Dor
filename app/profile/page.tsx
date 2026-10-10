"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [name, setName] = useState("ইউজার");
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      localStorage.setItem("userName", name); // নতুন নাম সেভ হচ্ছে
      toast.success("নাম সফলভাবে হালনাগাদ হয়েছে!");
      setIsUpdating(false);
      window.location.reload(); // পেজ রিলোড হলে ন্যাভবারেও নাম পাল্টে যাবে
    }, 800);
  };

  const handleLogout = () => {
    toast.success("সফলভাবে সাইন আউট হয়েছেন!");
    router.push("/signin");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 min-h-[65vh]">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-800">আমার প্রোফাইল</h1>
        <p className="text-gray-500 text-sm mt-1">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-xl uppercase">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{name}</h2>
              <p className="text-gray-500 text-sm">user@bazardor.com</p>
            </div>
          </div>
          <button onClick={handleLogout} className="border border-red-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            সাইন আউট
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">নাম হালনাগাদ করুন</h3>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">নাম</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors" />
            </div>
            <div>
              <button type="submit" disabled={isUpdating} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-70">
                {isUpdating ? "আপডেট হচ্ছে..." : "নাম হালনাগাদ করুন"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}