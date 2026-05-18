export default function PacksLoading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-40 px-4 md:px-8 max-w-[1400px] mx-auto">
      <div className="h-20 w-64 bg-white/5 rounded-lg animate-pulse mb-12" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
        ))}
      </div>
    </div>
  );
}
