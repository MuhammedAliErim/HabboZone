export default function AdminLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-300">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
          <div className="h-4 w-72 bg-[#1e293b] rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-[#1e293b] rounded-[3px] animate-pulse"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="habbo-box p-4 border border-[#1e293b]">
            <div className="h-3 w-20 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
            <div className="h-7 w-14 bg-[#1e293b] rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="habbo-box border border-[#1e293b] overflow-hidden">
        <div className="bg-[#0a1325] px-4 py-3 flex justify-between items-center border-b border-[#1e293b]">
          <div className="h-4 w-32 bg-[#1e293b] rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-[#1e293b] rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-[#1e293b]/50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 flex items-center gap-4">
              <div className="w-8 h-8 bg-[#1e293b] rounded-[3px] animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 bg-[#1e293b] rounded animate-pulse"></div>
                <div className="h-3 w-1/4 bg-[#1e293b] rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-16 bg-[#1e293b] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
