import Link from "next/link";

// english number ke bangla number e convert korar function
const enToBnNumber = (numStr: string | number) => {
  if (!numStr && numStr !== 0) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(numStr).replace(/\d/g, d => bnDigits[parseInt(d)]);
};

// ajker date ber korar jonno
const getBengaliDate = () => {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  
  const toBnNum = (num: number) => num.toString().split('').map(d => bnDigits[parseInt(d)] || d).join('');
  const d = new Date();
  
  return `${days[d.getDay()]}, ${toBnNum(d.getDate())} ${months[d.getMonth()]}, ${toBnNum(d.getFullYear())}`;
};

// unit format korar jonno choto ekta helper
const formatUnit = (unit: string) => {
  if (!unit) return "প্রতি কেজি";
  const u = unit.toLowerCase();
  if (u === 'kg') return 'প্রতি কেজি';
  if (u === 'litre') return 'প্রতি লিটার';
  if (u === 'dozen') return 'প্রতি ডজন';
  if (u === 'piece') return 'প্রতি পিস';
  return `প্রতি ${unit}`;
};

// Product Card Component (Figma design onujayi)
const ProductCard = ({ product }: { product: any }) => {
  const name = product?.nameBn || "পণ্যের নাম";
  const emoji = product?.image || "🛒";
  const unit = formatUnit(product?.unit);
  const price = enToBnNumber(product?.today || "0");
  
  let changeDir = '—';
  let changePct = '০.০';
  
  // change calculation
  if (product?.change && typeof product.change === 'object') {
    changeDir = product.change.dir === 'up' ? '▲' : (product.change.dir === 'down' ? '▼' : '—');
    let pctVal = parseFloat(product.change.pct || '0');
    changePct = enToBnNumber(isNaN(pctVal) ? '0' : Math.abs(pctVal).toString());
  }

  // color set korchi
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

export default async function Home() {
  const currentDate = getBengaliDate(); 
  let productsList: any[] = [];
  
  // Try korchi main API theke data anar
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", { cache: "no-store" });
    const data = await res.json();
    productsList = Array.isArray(data) ? data : (data?.products || data?.data || []);
    // console.log("Main api data:", productsList.length);
  } catch (error) {
    // Main api down thakle ei alternative API theke data asbe
    // console.log("Main api error, trying alternative...");
    try {
      const res2 = await fetch("https://api.api-store.workers.dev/api/bazardor/products", { cache: "no-store" });
      const data2 = await res2.json();
      productsList = Array.isArray(data2) ? data2 : (data2?.products || data2?.data || []);
    } catch (err) {
      console.error("Dui API e down!", err);
    }
  }

  // filter kore riser ar faller ber korchi (top 6 ta)
  const risers = [...productsList].filter((p: any) => p?.change?.dir === 'up').sort((a: any, b: any) => parseFloat(b?.change?.pct || 0) - parseFloat(a?.change?.pct || 0)).slice(0, 6);
  const fallers = [...productsList].filter((p: any) => p?.change?.dir === 'down').sort((a: any, b: any) => parseFloat(b?.change?.pct || 0) - parseFloat(a?.change?.pct || 0)).slice(0, 6);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-[#f0fdf4] rounded-2xl p-8 mb-12 flex flex-col-reverse md:flex-row items-center justify-between border border-green-100">
        <div className="max-w-lg">
          <div className="bg-green-100 text-green-800 font-medium text-sm px-4 py-1.5 rounded-full inline-block mb-4">
            {currentDate}
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

      {/* Riser Section */}
      {risers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-red-500">▲</span> আজ দাম বেড়েছে</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {risers.map((product: any, idx: number) => <ProductCard product={product} key={idx} />)}
          </div>
        </div>
      )}

      {/* Faller Section */}
      {fallers.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-green-600">▼</span> আজ দাম কমেছে</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fallers.map((product: any, idx: number) => <ProductCard product={product} key={idx} />)}
          </div>
        </div>
      )}

      {/* All Products */}
      <div id="সব-পণ্য">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="text-blue-500">■</span> সব পণ্য</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productsList.map((product: any, idx: number) => <ProductCard product={product} key={idx} />)}
        </div>
      </div>
    </main>
  );
}