import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Headphones, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import hero from "@/assets/hero.jpg";
import editorial from "@/assets/editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Orée — Prêt-à-porter multimarque premium" },
      {
        name: "description",
        content:
          "Découvrez une sélection de marques et de pièces de prêt-à-porter premium : streetwear, tailoring, sneakers et accessoires.",
      },
      { property: "og:title", content: "Maison Orée — Prêt-à-porter multimarque premium" },
      {
        property: "og:description",
        content: "Votre style. Vos marques. Votre identité. Une sélection de pièces premium.",
      },
    ],
  }),
  component: Index,
});

const ADVANTAGES = [
  { icon: Sparkles, title: "Marques reconnues", text: "Une sélection resserrée et exigeante." },
  { icon: BadgeCheck, title: "Produits authentiques", text: "Chaque pièce est vérifiée." },
  { icon: Truck, title: "Livraison rapide", text: "Expédition sous 24h ouvrées." },
  { icon: ShieldCheck, title: "Paiement sécurisé", text: "Transactions chiffrées." },
  { icon: Headphones, title: "Service client", text: "Une équipe joignable 6j/7." },
];

function Index() {
  const { products, brands, categories, hydrated } = useStore();
  const visible = products.filter((product) => product.status !== "brouillon");
  const news = [...visible]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <img
          src={hero}
          alt="Modèle portant une tenue minimaliste noire"
          width={1600}
          height={1200}
          className="h-[78vh] min-h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/45 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8">
            <div className="max-w-xl animate-fade-up">
              <p className="eyebrow">Collection Automne 2026</p>
              <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl">
                Votre style. Vos marques. Votre identité.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                Découvrez une sélection de marques et de pièces pensées pour révéler votre style.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-none px-8">
                  <Link to="/boutique">Découvrir la collection</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-none px-8">
                  <Link to="/boutique" search={{ sort: "nouveautes" }}>
                    Voir les nouveautés
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marques */}
      <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Nos maisons</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Les marques disponibles</h2>
          </div>
          <Link to="/boutique" className="link-underline text-sm text-muted-foreground">
            Tout parcourir
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              to="/boutique"
              search={{ brand: brand.id }}
              className="group border border-border bg-card p-5 text-center transition-colors hover:border-foreground"
            >
              <span className="font-display text-2xl">{brand.logoText}</span>
              <p className="mt-2 text-xs uppercase tracking-[0.14em]">{brand.name}</p>
              <p className="mt-2 hidden text-[11px] leading-relaxed text-muted-foreground sm:block">
                {brand.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Nouveautés */}
      <section className="mx-auto max-w-[1400px] px-4 pb-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Cette semaine</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Nouveautés</h2>
          </div>
          <Link
            to="/boutique"
            search={{ sort: "nouveautes" }}
            className="link-underline text-sm text-muted-foreground"
          >
            Voir tout
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid products={news} loading={!hydrated} />
        </div>
      </section>

      {/* Éditorial */}
      <section className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid items-stretch gap-0 md:grid-cols-2">
          <img
            src={editorial}
            alt="Deux modèles portant la nouvelle collection"
            loading="lazy"
            width={1408}
            height={1008}
            className="h-full min-h-[320px] w-full object-cover"
          />
          <div className="flex flex-col justify-center bg-secondary/50 px-8 py-14 lg:px-16">
            <p className="eyebrow">Nouvelle collection</p>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
              Découvrez les pièces qui définissent les tendances de cette saison.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Des matières nobles, des coupes franches et une palette neutre : une collection
              conçue pour durer bien au-delà d'une saison.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-none px-8">
                <Link to="/boutique">Explorer la collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
        <p className="eyebrow">Parcourir</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Catégories</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to="/boutique"
              search={{ category: category.id }}
              className="group relative overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <span className="absolute bottom-3 left-3 text-sm uppercase tracking-[0.16em] text-background">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-8 px-4 py-14 md:grid-cols-5 md:px-8">
          {ADVANTAGES.map((advantage) => (
            <div key={advantage.title}>
              <advantage.icon className="h-5 w-5" strokeWidth={1.4} />
              <h3 className="mt-3 text-sm">{advantage.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{advantage.text}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
