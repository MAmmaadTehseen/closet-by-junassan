import { ProductGridSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <Skeleton className="mb-6 h-14 w-64" />
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="hidden flex-col gap-5 lg:flex">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <ProductGridSkeleton count={12} />
      </div>
    </div>
  );
}
