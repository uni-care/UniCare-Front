import ItemCard from "@/components/marketplace/ItemCard";
import { DUMMY_ITEMS, CATEGORIES } from "./data";

export default function MarketplacePage() {
  return (
    <div className="bg-neutral-50 min-h-screen pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mb-2">Marketplace</h1>
          <p className="text-lg text-neutral-500 max-w-2xl italic">
            Discover, share, and trade engineering resources with your trusted community.
          </p>
        </div>

        {/* Search & Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">search</span>
            <input
              type="text"
              placeholder="Search resources, textbooks, tools..."
              className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-neutral-200 rounded-2xl px-8 py-4 font-bold text-neutral-700 hover:bg-neutral-50 transition-all shadow-sm cursor-pointer">
            <span className="material-symbols-outlined text-xl">tune</span>
            Filters
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${i === 0
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary/40"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {DUMMY_ITEMS.map((item) => (
            <ItemCard key={item.id} {...item} price={item.price as any} status={item.status as any} type={item.type as any} />
          ))}
        </div>

        {/* Pagination/Load More */}
        <div className="flex justify-center">
          <button className="group flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-10 py-4 font-bold text-neutral-800 hover:border-primary/60 transition-all shadow-sm cursor-pointer">
            View More Resources
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
