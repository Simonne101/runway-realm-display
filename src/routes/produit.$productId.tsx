import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Minus, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/produit/$productId")({
  head: () => ({
    meta: [
      { title: "Détail du produit — Maison Orée" },
      {
        name: "description",
        content:
          "Images, description, tailles, couleurs et disponibilité : toutes les informations avant l'ajout au panier.",
      },
      { property: "og:title", content: "Détail du produit — Maison Orée" },
      {
        property: "og:description",
        content: "Choisissez votre taille et votre couleur, puis ajoutez la pièce au panier.",
      },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { products, brands, addToCart } = useStore();
  const product = products.find((item) => item.id === productId);

  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-4 py-32 text-center">
          <h1 className="font-display text-3xl">Produit introuvable</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cette pièce n'est plus disponible dans notre catalogue.
          </p>
          <Button asChild className="mt-8 rounded-none px-8">
            <Link to="/boutique">Retour à la boutique</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? "Marque";
  const requiresSize = product.sizes.length > 1;
  const soldOut = product.status === "rupture" || product.stock === 0;
  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.status !== "brouillon" &&
        (item.categoryId === product.categoryId || item.brandId === product.brandId),
    )
    .slice(0, 4);

  const handleAdd = (buyNow = false) => {
    if (requiresSize && !size) {
      toast.error("Veuillez sélectionner une taille avant d'ajouter au panier.");
      return;
    }
    if (product.colors.length > 1 && !color) {
      toast.error("Veuillez sélectionner une couleur.");
      return;
    }
    addToCart({
      productId: product.id,
      name: product.name,
      brand: brandName,
      image: product.images[0] ?? "",
      price: product.price,
      size: size ?? product.sizes[0] ?? "Unique",
      color: color ?? product.colors[0] ?? "Standard",
      quantity,
    });
    toast.success("Produit ajouté au panier.");
    if (buyNow) navigate({ to: "/panier" });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <Link
          to="/boutique"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Boutique
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <div
              className="overflow-hidden bg-secondary/50"
              onClick={() => setZoom((value) => !value)}
            >
              <img
                src={product.images[activeImage] ?? product.images[0]}
                alt={product.name}
                className={`aspect-[4/5] w-full cursor-zoom-in object-cover transition-transform duration-500 ${
                  zoom ? "scale-150" : "hover:scale-105"
                }`}
              />
            </div>
            <div className="mt-3 flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 overflow-hidden border transition-colors ${
                    index === activeImage ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <img src={image} alt="" className="aspect-[4/5] w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <p className="eyebrow">{brandName}</p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-xl">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <Separator className="my-7" />

            <div>
              <h2 className="eyebrow">Couleur {color ? `· ${color}` : ""}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((option) => (
                  <button
                    key={option}
                    onClick={() => setColor(option)}
                    className={`border px-4 py-2 text-xs transition-colors ${
                      color === option
                        ? "border-foreground bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h2 className="eyebrow">
                Taille {requiresSize ? "(obligatoire)" : ""} {size ? `· ${size}` : ""}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSize(option)}
                    className={`min-w-12 border px-3 py-2 text-xs transition-colors ${
                      size === option
                        ? "border-foreground bg-primary text-primary-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Diminuer la quantité"
                  className="grid h-11 w-11 place-items-center hover:bg-muted"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Augmenter la quantité"
                  className="grid h-11 w-11 place-items-center hover:bg-muted"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {soldOut ? "Rupture de stock" : `En stock · ${product.stock} pièces`}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 flex-1 rounded-none"
                disabled={soldOut}
                onClick={() => handleAdd(false)}
              >
                Ajouter au panier
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 flex-1 rounded-none"
                disabled={soldOut}
                onClick={() => handleAdd(true)}
              >
                Acheter maintenant
              </Button>
            </div>

            <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4" strokeWidth={1.4} /> Livraison sous 24 à 72h, offerte dès
                50 000 FCFA.
              </p>
              <p className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" strokeWidth={1.4} /> Retours gratuits sous 14 jours.
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.4} /> Pièce authentique garantie.
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-display text-2xl sm:text-3xl">Vous aimerez aussi</h2>
            <div className="mt-8">
              <ProductGrid products={related} />
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}