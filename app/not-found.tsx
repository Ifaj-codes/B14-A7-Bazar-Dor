import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl text-orange-500 font-extrabold mb-4">৪0৪</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">পেজটি পাওয়া যায়নি!</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">আপনি যে পেজটি খুঁজছেন তা হয়তো ডিলিট হয়ে গেছে, অথবা লিংকটি ভুল।</p>
      <Link href="/" className="btn bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-10">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}