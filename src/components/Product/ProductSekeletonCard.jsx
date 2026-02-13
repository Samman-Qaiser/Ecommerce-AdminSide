import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden  max-h-[60vh] border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Image Skeleton */}
      <div className="relative aspect-2/4 bg-gray-100">
        <Skeleton className="w-full h-full" />
        {/* Badge Skeleton */}
        <Skeleton className="absolute top-1 left-3 h-6 w-16 rounded-full" />
        {/* Wishlist Icon Skeleton */}
        <Skeleton className="absolute top-1 right-3 h-8 w-8 rounded-full" />
      </div>

      <CardContent className="p-1 space-y-1">
        {/* Category Skeleton */}
        <Skeleton className="h-3 w-20" />
        
        {/* Title Skeleton */}
        <Skeleton className="h-1 w-full" />
        <Skeleton className="h-1 w-3/4" />

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-24" />
          <Skeleton className="h-2 w-12" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-2 w-16" />
          <Skeleton className="h-2 w-12" />
        </div>
      </CardContent>

      <CardFooter className="p-1 pt-0 grid grid-cols-2 gap-1">
        {/* Buttons Skeleton */}
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

// Grid Layout ke liye multiple skeletons
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}