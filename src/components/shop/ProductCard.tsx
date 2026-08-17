import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, brands } = useStore();
  const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? "Marque";
  const primary = product.images[0] ?? "";
  const secondary = product.images[1] ?? primary;
  const defaultSize = product.sizes[0] ?? "Unique";
  const defaultColor = product.colors[0] ?? "Standard";

  const quickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      brand: brandName,
      image: primary,
      price: product.price,
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
    });
    toast.success("Produit ajouté au panier.", {
      description: `${product.name} · ${defaultSize} · ${defaultColor}`,
    });
  };

  return (
    <Link
      to="/produit/$productId"
      params={{ productId: product.id }}
      className="group block"
    >
      <div className="relative overflow-hidden bg-secondary/50">
        <img
          src={primary}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-0"
        />
        <img
          src={secondary}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 aspect-[4/5] w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="bg-primary px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-primary-foreground">
              {product.badge}
            </span>
          )}
          {product.oldPrice && (
            <span className="bg-accent px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-foreground">
              Promo
            </span>
          )}
          {product.status === "rupture" && (
            <span className="bg-muted px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Épuisé
            </span>
          )}
        </div>

        <button
          onClick={quickAdd}
          disabled={product.status === "rupture"}
          aria-label={`Ajouter ${product.name} au panier`}
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center bg-background text-foreground opacity-0 shadow-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>

      <div className="pt-3">
        <p className="eyebrow">{brandName}</p>
        <h3 className="mt-1 text-sm font-normal leading-snug">{product.name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}