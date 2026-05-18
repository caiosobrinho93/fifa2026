export default function InventoryLoading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-40 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="h-20 w-64 bg-white/5 rounded-lg animate-pulse mb-8" />
      <div className="h-12 bg-white/5 rounded-sm animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    </div>
  );
}
