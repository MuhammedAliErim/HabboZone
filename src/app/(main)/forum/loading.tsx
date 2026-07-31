export default function ForumLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-8 w-56 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
          <div className="h-4 w-64 bg-[#1e293b] rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-[#1e293b] rounded-[3px] animate-pulse"></div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="habbo-box p-4 border border-[#1e293b] flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1e293b] rounded-[3px] shrink-0 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-[#1e293b] rounded animate-pulse"></div>
              <div className="h-3 w-1/2 bg-[#1e293b] rounded animate-pulse"></div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 w-16 bg-[#1e293b] rounded animate-pulse ml-auto"></div>
              <div className="h-3 w-20 bg-[#1e293b] rounded animate-pulse ml-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
