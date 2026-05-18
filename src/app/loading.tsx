export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 rounded-md bg-primary/40" />
        </div>
        <div className="h-2 w-24 bg-white/5 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
