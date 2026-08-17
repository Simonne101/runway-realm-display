import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Accueil", to: "/", search: {} },
  { label: "Marques", to: "/boutique", search: { section: "marques" } },
  { label: "Collections", to: "/boutique", search: {} },
  { label: "Nouveautés", to: "/boutique", search: { sort: "nouveautes" } },
] as const;

export function Header() {
  const { cartCount } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pop, setPop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartCount === 0) return;
    setPop(true);
    const timer = setTimeout(() => setPop(false), 400);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSearchOpen(false);
    navigate({ to: "/boutique", search: { q: query || undefined } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 md:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <span className="font-display text-2xl">MAISON ORÉE</span>
              <nav className="mt-8 flex flex-col gap-5">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    search={item.search}
                    className="text-lg font-light"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link to="/panier" className="text-lg font-light">
                  Panier ({cartCount})
                </Link>
                <Link to="/dashboard" className="text-sm text-muted-foreground">
                  Espace administrateur
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="truncate font-display text-xl tracking-[0.18em] md:text-2xl">
            MAISON ORÉE
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-9 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              className="link-underline text-[0.8rem] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Rechercher"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
          </button>
          <Link
            to="/dashboard"
            aria-label="Espace administrateur"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <User className="h-[18px] w-[18px]" />
          </Link>
          <Link
            to="/panier"
            aria-label="Panier"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {cartCount > 0 && (
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground",
                  pop && "animate-cart-pop",
                )}
              >
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <form
          onSubmit={submitSearch}
          className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 pb-4 md:px-8"
        >
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un vêtement, une marque…"
            className="h-11 rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <Button type="submit" className="h-11 rounded-none px-6">
            Rechercher
          </Button>
        </form>
      )}
    </header>
  );
}