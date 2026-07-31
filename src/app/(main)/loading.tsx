export default function MainLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-300">
      {/* Hero Skeleton */}
      <div className="mb-8">
        <div className="h-3 w-24 bg-[#1e293b] rounded-full mb-4 animate-pulse"></div>
        <div className="h-9 w-2/3 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
        <div className="h-4 w-1/2 bg-[#1e293b] rounded animate-pulse"></div>
      </div>

      {/* Featured Banner Skeleton */}
      <div className="h-[180px] md:h-[260px] bg-[#0a1325] border border-[#1e293b] rounded-[4px] mb-8 relative overflow-hidden animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[#1e293b] font-black uppercase tracking-widest text-sm">Yükleniyor...</div>
        </div>
      </div>

      {/* Section title */}
      <div className="h-5 w-40 bg-[#1e293b] rounded mb-5 animate-pulse"></div>

      {/* News Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="habbo-box p-3 flex flex-col gap-3 border border-[#1e293b]">
            <div className="w-full h-[140px] bg-[#1e293b] rounded-[4px] animate-pulse"></div>
            <div className="space-y-2.5">
              <div className="h-4 w-4/5 bg-[#1e293b] rounded animate-pulse"></div>
              <div className="h-3 w-full bg-[#1e293b] rounded animate-pulse"></div>
              <div className="h-3 w-2/3 bg-[#1e293b] rounded animate-pulse"></div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/50">
              <div className="h-4 w-24 bg-[#1e293b] rounded-full animate-pulse"></div>
              <div className="h-3 w-16 bg-[#1e293b] rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-5 w-32 bg-[#1e293b] rounded mb-5 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="habbo-box p-4 flex gap-3 border border-[#1e293b]">
                <div className="w-16 h-16 bg-[#1e293b] rounded-[3px] shrink-0 animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-[#1e293b] rounded animate-pulse"></div>
                  <div className="h-3 w-full bg-[#1e293b] rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-[#1e293b] rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-5 w-24 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="habbo-box p-4 border border-[#1e293b]">
              <div className="h-3 w-2/3 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
              <div className="h-8 w-8 bg-[#1e293b] rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
