import type { Product } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  products: Product[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  loading,
  emptyTitle = "Aucun produit trouvé",
  emptyDescription = "Essayez d'ajuster vos filtres ou votre recherche.",
}: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[4/5] w-full rounded-none" />
            <Skeleton className="mt-3 h-3 w-16 rounded-none" />
            <Skeleton className="mt-2 h-3.5 w-3/4 rounded-none" />
            <Skeleton className="mt-2 h-3.5 w-20 rounded-none" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border px-6 py-24 text-center">
        <h3 className="font-display text-2xl">{emptyTitle}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}