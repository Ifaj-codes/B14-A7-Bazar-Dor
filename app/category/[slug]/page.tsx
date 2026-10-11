"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// নাম্বার কনভার্টার
const enToBnNumber = (numStr: string | number) => {
  if (!numStr && numStr !== 0) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(numStr).replace(/\d/g, d => bnDigits[parseInt(d)]);
};

const formatUnit = (unit: string) => {
  if (!unit) return "প্রতি কেজি";
  const u = unit.toLowerCase();
  if (u === 'kg') return 'প্রতি কেজি';
  if (u === 'litre') return 'প্রতি লিটার';
  if (u === 'dozen') return 'প্রতি ডজন';
  if (u === 'piece') return 'প্রতি পিস';
  return `প্রতি ${unit}`;
};

// প্রোডাক্ট কার্ড কম্পোনেন্ট
const ProductCard = ({ product }: { product: any }) => {
  const name = product?.nameBn || "পণ্যের নাম";
  const emoji = product?.image || "🛒";
  const unit = formatUnit(product?.unit);
  const price = enToBnNumber(product?.today || "0");
  
  let changeDir = '—';
  let changePct = '০.০';
  
  if (product?.change && typeof product.change === 'object') {
    changeDir = product.change.dir === 'up' ? '▲' : (product.change.dir === 'down' ? '▼' : '—');
    let pctVal = parseFloat(product.change.pct || '0');
    changePct = enToBnNumber(isNaN(pctVal) ? '0' : Math.abs(pctVal).toString());
  }

  const changeColor = changeDir === '▲' ? 'text-red-500' : changeDir === '▼' ? 'text-green-600' : 'text-gray-500';

  return (
    <Link href={`/product/${product?.slug || product?.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="text-3xl bg-gray-50 p-2 rounded-lg">{emoji}</div>
             <div>
               <h2 className="font-bold text-gray-800">{name}</h2>
               <p className="text-xs text-gray-500">{unit}</p>
             </div>
          </div>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-[10px] text-gray-400">আজকের দাম</p>
            <p className="font-bold text-gray-800 text-lg">৳ {price}</p>
          </div>
          <div className={`text-xs font-bold flex items-center gap-1 ${changeColor}`}>
            {changeDir} {changePct}%
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        const data = await res.json();
        const all = Array.isArray(data) ? data : (data?.products || data?.data || []);
        
        // এখানে slug চেক করার লজিকটা একটু ফ্লেক্সিবল করে দিয়েছি
        const filtered = all.filter((p: any) => p.category?.toLowerCase() === slug?.toLowerCase());
        setProducts(filtered);
      } catch (error) {
        console.error("API Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    const priceA = a.today || 0;
    const priceB = b.today || 0;
    if (sortOrder === "lowToHigh") return priceA - priceB;
    if (sortOrder === "highToLow") return priceB - priceA;
    return 0;
  });

  // ক্যাটাগরির নাম বাংলায় দেখানোর লজিক (এখানেই মেইন ফিক্সটা করেছি)
  const getCategoryDetails = (s: string) => {
    const categories: Record<string, { name: string; emoji: string }> = {
      'chal': { name: 'চাল', emoji: '🍚' },
      'dal': { name: 'ডাল', emoji: '🥣' },
      'tel': { name: 'তেল', emoji: '🛢️' },
      'sobji': { name: 'সবজি', emoji: '🥬' },
      'mach': { name: 'মাছ', emoji: '🐟' },
      'mangsho': { name: 'মাংস', emoji: '🥩' },
      'dim-dudh': { name: 'ডিম-দুধ', emoji: '🥚' },
      'mosholla': { name: 'মসলা', emoji: '🌶️' }
    };
    // যদি slug ম্যাচ না করে তাহলে ডিফল্ট ভ্যালু দেখাবে
    return categories[s] || { name: s, emoji: '📦' }; 
  };

  const currentCategory = getCategoryDetails(slug);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[75vh]">
      {/* ক্যাটাগরি হেডার ও ফিল্টার */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
           <span className="bg-green-50 text-green-600 p-2 rounded-xl text-xl">{currentCategory.emoji}</span> 
           {currentCategory.name}
        </h1>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 font-medium">সাজান:</span>
          <select 
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer bg-white font-medium text-gray-700"
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="lowToHigh">দাম: কম থেকে বেশি</option>
            <option value="highToLow">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* প্রোডাক্ট লিস্ট */}
      {loading ? (
         <div className="text-center py-20 text-green-600 font-bold animate-pulse">লোড হচ্ছে...</div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product, idx) => (
            <ProductCard product={product} key={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">এই ক্যাটাগরিতে আপাতত কোনো পণ্য নেই।</div>
      )}
    </div>
  );
}