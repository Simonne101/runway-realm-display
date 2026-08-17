import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="font-display text-2xl tracking-[0.18em]">MAISON ORÉE</span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Boutique de prêt-à-porter multimarque. Une sélection resserrée de pièces
              authentiques, choisies pour leur coupe et leurs matières.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <span
                  key={index}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border transition-colors hover:bg-background"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow">Liens rapides</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Accueil</Link></li>
              <li><Link to="/boutique" className="hover:text-foreground">Boutique</Link></li>
              <li><Link to="/panier" className="hover:text-foreground">Panier</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground">Administration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Catégories</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {["hommes", "femmes", "sneakers", "accessoires", "streetwear"].map((category) => (
                <li key={category}>
                  <Link
                    to="/boutique"
                    search={{ category }}
                    className="capitalize hover:text-foreground"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow">Newsletter</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Nouvelles pièces et sélections privées, une fois par mois.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                toast.success("Merci, votre inscription est enregistrée.");
              }}
            >
              <Input
                type="email"
                required
                placeholder="Votre e-mail"
                className="h-10 rounded-none bg-background"
              />
              <Button type="submit" className="h-10 rounded-none px-4">
                OK
              </Button>
            </form>
            <div className="mt-6 space-y-1 text-sm text-muted-foreground">
              <p>contact@maison-oree.com</p>
              <p>+225 07 00 00 00</p>
              <p>Abidjan, Côte d'Ivoire</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Maison Orée. Tous droits réservés.</p>
          <p>Mentions légales · CGV · Politique de confidentialité</p>
        </div>
      </div>
    </footer>
  );
}