"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products");
        const data = await res.json();
        setProductsList(Array.isArray(data) ? data : (data?.products || data?.data || []));
      } catch (error) {
        console.error("API Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sortedProducts = [...productsList].sort((a: any, b: any) => {
    const priceA = a?.today || 0;
    const priceB = b?.today || 0;
    if (sortOrder === 'highToLow') return priceB - priceA;
    if (sortOrder === 'lowToHigh') return priceA - priceB;
    return 0;
  });

  const risers = [...productsList].filter((p: any) => p?.change?.dir === 'up').sort((a: any, b: any) => parseFloat(b?.change?.pct || 0) - parseFloat(a?.change?.pct || 0)).slice(0, 6);
  const fallers = [...productsList].filter((p: any) => p?.change?.dir === 'down').sort((a: any, b: any) => parseFloat(b?.change?.pct || 0) - parseFloat(a?.change?.pct || 0)).slice(0, 6);

  if (loading) return <div className="text-center py-20 text-gray-500 bg-white min-h-screen">লোড হচ্ছে...</div>;

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-8 bg-white">
        {/* Hero Section */}
        <div className="bg-[#f0fdf4] rounded-2xl p-8 mb-12 flex flex-col-reverse md:flex-row items-center justify-between border border-green-100">
          <div className="max-w-lg">
            <div className="bg-green-100 text-green-800 font-medium text-sm px-4 py-1.5 rounded-full inline-block mb-4">
              আজকের বাজার দর আপডেট
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              আজকের বাজারের দাম এক নজরে
            </h1>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>
            <a href="#সব-পণ্য" className="bg-[#16a34a] hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium inline-block transition-colors">
              সব পণ্য দেখুন
            </a>
          </div>
          <div className="mb-6 md:mb-0">
            <img src="/bazar-hero.png" alt="Hero" className="w-48 md:w-72" />
          </div>
        </div>

        {risers.length > 0 && sortOrder === 'none' && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-red-500">▲</span> আজ দাম বেড়েছে</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {risers.map((product: any, idx: number) => <ProductCard product={product} key={idx} />)}
            </div>
          </div>
        )}

        {fallers.length > 0 && sortOrder === 'none' && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-green-600">▼</span> আজ দাম কমেছে</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {fallers.map((product: any, idx: number) => <ProductCard product={product} key={idx} />)}
            </div>
          </div>
        )}

        <div id="সব-পণ্য">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><span className="text-blue-500">■</span> সব পণ্য</h2>
              
              <select 
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700 font-medium"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="none">ডিফল্ট</option>
                <option value="highToLow">দাম: বেশি থেকে কম</option>
                <option value="lowToHigh">দাম: কম থেকে বেশি</option>
              </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product: any, idx: number) => <ProductCard product={product} key={idx} />)}
          </div>
        </div>
      </main>
    </div>
  );
}