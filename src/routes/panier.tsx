import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Votre panier — Maison Orée" },
      {
        name: "description",
        content:
          "Vérifiez vos articles, ajustez les quantités et consultez le total avant de passer commande.",
      },
      { property: "og:title", content: "Votre panier — Maison Orée" },
      {
        property: "og:description",
        content: "Modifiez les quantités et finalisez votre sélection en quelques clics.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQuantity, removeFromCart, subtotal, shipping, total, clearCart } = useStore();

  if (cart.length === 0) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-lg px-4 py-28 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-border">
            <ShoppingBag className="h-6 w-6" strokeWidth={1.3} />
          </div>
          <h1 className="mt-8 font-display text-3xl">Votre panier est actuellement vide.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Parcourez nos marques et ajoutez vos premières pièces.
          </p>
          <Button asChild size="lg" className="mt-8 rounded-none px-8">
            <Link to="/boutique">Découvrir nos collections</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <p className="eyebrow">Panier</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Votre sélection</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            {cart.map((line) => (
              <div
                key={line.key}
                className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-border pb-6 sm:grid-cols-[120px_minmax(0,1fr)_auto]"
              >
                <img
                  src={line.image}
                  alt={line.name}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="min-w-0">
                  <p className="eyebrow">{line.brand}</p>
                  <h2 className="mt-1 text-sm">{line.name}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Taille {line.size} · {line.color}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatPrice(line.price)} l'unité
                  </p>

                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(line.key, line.quantity - 1)}
                        aria-label="Diminuer la quantité"
                        className="grid h-9 w-9 place-items-center hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.key, line.quantity + 1)}
                        aria-label="Augmenter la quantité"
                        className="grid h-9 w-9 place-items-center hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(line.key);
                        toast.success("Article retiré du panier.");
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
                <div className="col-span-2 text-sm sm:col-span-1 sm:text-right">
                  {formatPrice(line.price * line.quantity)}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="rounded-none">
                <Link to="/boutique">Continuer mes achats</Link>
              </Button>
              <Button
                variant="ghost"
                className="rounded-none text-muted-foreground"
                onClick={() => {
                  clearCart();
                  toast.success("Panier vidé.");
                }}
              >
                Vider le panier
              </Button>
            </div>
          </div>

          <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-28">
            <h2 className="text-sm uppercase tracking-[0.16em]">Résumé</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Livraison</span>
                <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm uppercase tracking-[0.14em]">Total</span>
              <span className="text-lg">{formatPrice(total)}</span>
            </div>
            <Button
              size="lg"
              className="mt-6 h-12 w-full rounded-none"
              onClick={() => toast.success("Commande enregistrée. Le paiement arrive bientôt.")}
            >
              Passer la commande
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Livraison offerte dès 50 000 FCFA. Retours gratuits sous 14 jours.
            </p>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}