import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductFilter } from "@/components/shop/ProductFilter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

const searchSchema = z.object({
  q: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  sort: z.string().optional(),
  section: z.string().optional(),
});

export const Route = createFileRoute("/boutique")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Notre collection — Boutique Maison Orée" },
      {
        name: "description",
        content:
          "Parcourez toute la collection : filtrez par marque, catégorie, genre, taille, couleur et prix.",
      },
      { property: "og:title", content: "Notre collection — Boutique Maison Orée" },
      {
        property: "og:description",
        content: "Filtrez et découvrez tous les vêtements et accessoires disponibles.",
      },
    ],
  }),
  component: Boutique,
});

function Boutique() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { products, brands, hydrated } = useStore();

  const [query, setQuery] = useState(search.q ?? "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    search.brand ? [search.brand] : [],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    search.category ? [search.category] : [],
  );
  const [genders, setGenders] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(120000);
  const [sort, setSort] = useState(search.sort ?? "nouveautes");

  const visible = useMemo(
    () => products.filter((product) => product.status !== "brouillon"),
    [products],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = visible.filter((product) => {
      const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? "";
      if (needle && !`${product.name} ${brandName}`.toLowerCase().includes(needle)) return false;
      if (selectedBrands.length && !selectedBrands.includes(product.brandId)) return false;
      if (selectedCategories.length && !selectedCategories.includes(product.categoryId))
        return false;
      if (genders.length && !genders.includes(product.gender)) return false;
      if (sizes.length && !product.sizes.some((size) => sizes.includes(size))) return false;
      if (colors.length && !product.colors.some((color) => colors.includes(color))) return false;
      if (product.price > maxPrice) return false;
      return true;
    });

    switch (sort) {
      case "prix-croissant":
        return result.sort((a, b) => a.price - b.price);
      case "prix-decroissant":
        return result.sort((a, b) => b.price - a.price);
      case "populaires":
        return result.sort((a, b) => b.popularity - a.popularity);
      default:
        return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [visible, brands, query, selectedBrands, selectedCategories, genders, sizes, colors, maxPrice, sort]);

  const filters = (
    <ProductFilter
      selectedBrands={selectedBrands}
      selectedCategories={selectedCategories}
      genders={genders}
      sizes={sizes}
      colors={colors}
      maxPrice={maxPrice}
      onBrands={setSelectedBrands}
      onCategories={setSelectedCategories}
      onGenders={setGenders}
      onSizes={setSizes}
      onColors={setColors}
      onMaxPrice={setMaxPrice}
      onReset={() => {
        setSelectedBrands([]);
        setSelectedCategories([]);
        setGenders([]);
        setSizes([]);
        setColors([]);
        setMaxPrice(120000);
        navigate({ search: {} });
      }}
    />
  );

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <p className="eyebrow">Boutique</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Notre collection</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length} produit{filtered.length > 1 ? "s" : ""} disponible
          {filtered.length > 1 ? "s" : ""}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit ou une marque…"
              className="h-11 rounded-none pr-9"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 rounded-none lg:hidden">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto p-6">
                {filters}
              </SheetContent>
            </Sheet>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-11 w-full rounded-none sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nouveautes">Nouveautés</SelectItem>
                <SelectItem value="prix-croissant">Prix croissant</SelectItem>
                <SelectItem value="prix-decroissant">Prix décroissant</SelectItem>
                <SelectItem value="populaires">Produits populaires</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden lg:block">{filters}</aside>
          <ProductGrid products={filtered} loading={!hydrated} />
        </div>
      </div>
    </SiteLayout>
  );
}