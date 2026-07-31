export default function NewsLoading() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-300">
      <div className="h-8 w-48 bg-[#1e293b] rounded mb-3 animate-pulse"></div>
      <div className="h-4 w-72 bg-[#1e293b] rounded mb-8 animate-pulse"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
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
    </div>
  );
}
