"use client";
import Marquee from "react-fast-marquee";

export default function PriceTicker() {
  const items = [
    { name: "মিনিকেট চাল", price: "৭২ টাকা/কেজি", status: "▲ ১.২%" },
    { name: "সোনালী মুরগি", price: "২৭০ টাকা/কেজি", status: "▼ ২.০%" },
    { name: "ডিম", price: "১৫০ টাকা/ডজন", status: "— ০.০%" },
    { name: "কাঁচা মরিচ", price: "১৬০ টাকা/কেজি", status: "▲ ৫.০%" },
  ];

  return (
    <div className="bg-orange-50 border-b border-orange-100 py-2">
      <div className="max-w-7xl mx-auto flex overflow-hidden">
        <div className="bg-orange-500 text-white px-3 py-1 text-sm font-bold whitespace-nowrap z-10 shadow-sm">
          আজকের বাজার
        </div>
        <Marquee speed={40} gradient={false} className="text-sm font-medium">
          {items.map((item, idx) => (
            <span key={idx} className="mx-6 flex items-center gap-2">
              <span className="text-gray-700">{item.name}: {item.price}</span>
              <span className={item.status.includes('▲') ? 'text-green-600' : item.status.includes('▼') ? 'text-red-600' : 'text-gray-500'}>
                {item.status}
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}