import Link from "next/link";

const enToBnNumber = (numStr: string | number) => {
  if (!numStr && numStr !== 0) return '০';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(numStr).replace(/\d/g, d => bnDigits[parseInt(d)]);
};

// dynamic params received here
export default async function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug; // url theke slug nilam
  
  let singleProduct: any = null;

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/bazardor/products", { cache: "no-store" });
    const data = await res.json();
    const allProductsArray = Array.isArray(data) ? data : (data?.products || data?.data || []);
    
    // find matching product
    singleProduct = allProductsArray.find((p: any) => p.slug === productSlug || String(p.id) === productSlug);
  } catch (error) {
     // fallback api
     try {
        const res2 = await fetch("https://api.api-store.workers.dev/api/bazardor/products", { cache: "no-store" });
        const data2 = await res2.json();
        const allProductsArray2 = Array.isArray(data2) ? data2 : (data2?.products || data2?.data || []);
        singleProduct = allProductsArray2.find((p: any) => p.slug === productSlug || String(p.id) === productSlug);
     } catch (err){
         console.error(err);
     }
  }

  // Jodi kono data na thake 404 dekhabo
  if (!singleProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl text-red-500 font-bold mb-4">পণ্যটি পাওয়া যায়নি!</h1>
        <Link href="/" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">হোম পেজে ফিরে যান</Link>
      </div>
    );
  }

  // Min, Max and Average calculation korchi ekhane
  const allMins = singleProduct.markets?.map((m: any) => m.min) || [];
  const allMaxs = singleProduct.markets?.map((m: any) => m.max) || [];
  
  const globalMin = allMins.length > 0 ? Math.min(...allMins) : (singleProduct.today || 0);
  const globalMax = allMaxs.length > 0 ? Math.max(...allMaxs) : (singleProduct.today || 0);
  
  // gor dam ber korar formula
  const avgPrice = Math.round((globalMin + globalMax) / 2) || 0;

  let changeDir = '—';
  let changePct = '০.০';
  
  if (singleProduct?.change && typeof singleProduct.change === 'object') {
    changeDir = singleProduct.change.dir === 'up' ? '▲' : (singleProduct.change.dir === 'down' ? '▼' : '—');
    let pctVal = parseFloat(singleProduct.change.pct || '0');
    changePct = enToBnNumber(isNaN(pctVal) ? '0' : Math.abs(pctVal).toString());
  }
  const changeColor = changeDir === '▲' ? 'text-red-500' : changeDir === '▼' ? 'text-green-600' : 'text-gray-500';

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 min-h-[75vh]">
      {/* Breadcrumb setup */}
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-green-600">হোম</Link>
        <span>&gt;</span>
        <Link href={`/category/${singleProduct.category}`} className="hover:text-green-600">{singleProduct.categoryNameBn || "ক্যাটাগরি"}</Link>
        <span>&gt;</span>
        <span className="font-bold text-gray-800">{singleProduct.nameBn}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-blue-50 p-4 rounded-xl border border-gray-100">{singleProduct.image || "🛒"}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
              {singleProduct.nameBn}
            </h1>
            <p className="text-sm text-gray-500 mb-2">প্রতি কেজি • <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs ml-1">{singleProduct.categoryNameBn || "ক্যাটাগরি"}</span></p>
            <p className="text-xs text-gray-500">গতকালের তুলনায় আজ দাম {changeDir === '▲' ? 'বেড়েছে' : changeDir === '▼' ? 'কমেছে' : 'অপরিবর্তিত'} <span className={`font-bold ${changeColor}`}>{changePct}%</span></p>
          </div>
        </div>
        
        <div className="md:text-right md:border-l border-gray-200 md:pl-8 pt-4 md:pt-0 border-t md:border-t-0 mt-4 md:mt-0 flex md:flex-col justify-between items-center md:items-end">
          <p className="text-xs text-gray-500 md:mb-1">আজকের দাম</p>
          <div className="text-center md:text-right">
             <p className="text-4xl font-bold text-gray-800">{enToBnNumber(singleProduct.today || 0)}</p>
             <p className="text-xs text-gray-500 mt-1">টাকা / কেজি</p>
          </div>
          <p className={`text-xs font-bold mt-2 ${changeColor}`}>{changeDir} {changePct}%</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 text-lg mb-4">দামের সারসংক্ষেপ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">সর্বনিম্ন দাম</p>
          <p className="text-2xl font-bold text-green-600">{enToBnNumber(globalMin)} <span className="text-sm font-normal text-red-500">টাকা</span></p>
          <p className="text-[10px] text-gray-400 mt-1">সবচেয়ে কম দামের বাজার</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">সর্বোচ্চ দাম</p>
          <p className="text-2xl font-bold text-red-500">{enToBnNumber(globalMax)} <span className="text-sm font-normal text-red-500">টাকা</span></p>
          <p className="text-[10px] text-gray-400 mt-1">সবচেয়ে বেশি দামের বাজার</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-xs text-gray-500 mb-2">গড় দাম</p>
          <p className="text-2xl font-bold text-green-600">{enToBnNumber(avgPrice)} <span className="text-sm font-normal text-green-600">টাকা</span></p>
          <p className="text-[10px] text-gray-400 mt-1">প্রতি কেজি এর হিসাবে</p>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 text-lg mb-4">বাজারভিত্তিক আজকের দাম</h3>
      
      {/* Market table details */}
      {singleProduct.markets && singleProduct.markets.length > 0 ? (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
          <table className="table w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="font-medium py-4 px-6 text-left w-1/4">বাজার</th>
                <th className="font-medium py-4 px-6 text-left w-1/4">বিভাগ</th>
                <th className="font-medium py-4 px-6 text-left">সর্বনিম্ন</th>
                <th className="font-medium py-4 px-6 text-left">সর্বোচ্চ</th>
                <th className="font-medium py-4 px-6 text-left bg-gray-100/50">গড়</th>
              </tr>
            </thead>
            <tbody>
              {singleProduct.markets.map((market: any, idx: number) => {
                const mAvg = Math.round((market.min + market.max) / 2);
                return (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-gray-700">{market.market}</td>
                    <td className="py-4 px-6 text-gray-500">{market.division}</td>
                    <td className="py-4 px-6 text-gray-700">{enToBnNumber(market.min)} টাকা</td>
                    <td className="py-4 px-6 text-gray-700">{enToBnNumber(market.max)} টাকা</td>
                    <td className="py-4 px-6 text-gray-700 font-medium bg-gray-50/50">{enToBnNumber(mAvg)} টাকা</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center">
           <p className="text-gray-500">এই পণ্যটির আলাদা কোনো বাজারের দাম পাওয়া যায়নি।</p>
        </div>
      )}
    </main>
  );
}