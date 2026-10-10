"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// utility function for converting to bangla
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
    <Link href={`/product/${product?.slug || product?.id || 1}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer h-full">
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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [productsData, setProductsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  // react hook theke params niteshi
  useEffect(() => {
    params.then(res => setSlug(res.slug));
  }, [params]);

  // category products fetch
  useEffect(() => {
    if (!slug) return;
    
    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      let allData = [];

      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        if(!res.ok) throw new Error("Main API error");
        const data = await res.json();
        allData = Array.isArray(data) ? data : (data.products || data.data || []);
      } catch (error) {
        // console.log("switching to alternative api");
        try {
          const res2 = await fetch("https://api.api-store.workers.dev/api/bazardor/products");
          const data2 = await res2.json();
          allData = Array.isArray(data2) ? data2 : (data2.products || data2.data || []);
        } catch (err) {
          console.error("Data fetch failed", err);
        }
      }

      // slug er sathe match kore filter korchi
      const filteredCategory = allData.filter((p: any) => 
        p.category?.toLowerCase() === slug.toLowerCase() || 
        p.categoryNameEn?.toLowerCase() === slug.toLowerCase()
      );

      setProductsData(filteredCategory);
      setIsLoading(false);
    };

    fetchCategoryProducts();
  }, [slug]);

  // Challenge 1: Sorting Implementation (low to high, high to low)
  const sortedProducts = [...productsData].sort((a: any, b: any) => {
    const priceA = a.today || 0;
    const priceB = b.today || 0;
    
    if (sortOrder === "asc") {
        return priceA - priceB;
    } else if (sortOrder === "desc") {
        return priceB - priceA;
    }
    return 0; // default state e kichu korbe na
  });

  const categoryTitles: Record<string, string> = {
    chal: "চাল", dal: "ডাল", tel: "তেল", sobji: "সবজি", mach: "মাছ", mangsho: "মাংস"
  };
  const title = categoryTitles[slug] || "পণ্যসমূহ";

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 min-h-[70vh]">
      
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 mb-6">
        <div className="text-4xl bg-gray-50 p-3 rounded-xl">
          {slug === 'chal' ? '🍚' : slug === 'dal' ? '🫘' : slug === 'tel' ? '🛢️' : slug === 'sobji' ? '🥬' : slug === 'mach' ? '🐟' : slug === 'mangsho' ? '🥩' : '🛒'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500">প্রতি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <p className="text-sm text-gray-500">মোট {enToBnNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে</p>
        
        {/* Challenge 1: Dropdown for sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">সাজান</span>
          <select 
            className="select select-sm select-bordered bg-white border-gray-300 text-gray-700 outline-none focus:border-green-600 rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="skeleton h-32 w-full rounded-xl bg-gray-100"></div>
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedProducts.map((product: any, idx: number) => (
            <ProductCard product={product} key={idx} />
          ))}
        </div>
      ) : (
         <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
           <h2 className="text-2xl font-bold text-gray-800 mb-2">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি!</h2>
         </div>
      )}
    </main>
  );
}