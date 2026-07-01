import Skeleton from "./Skeleton";

export default function HomepageSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      
      {/* Hero */}
      <Skeleton className="h-[300px] w-full rounded-xl" />

      {/* Sections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    </div>
  );
}