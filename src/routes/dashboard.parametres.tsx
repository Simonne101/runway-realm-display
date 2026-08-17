import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Administration Maison Orée" },
      { name: "description", content: "Configurez les informations de la boutique et les options de livraison." },
      { property: "og:title", content: "Paramètres — Administration" },
      { property: "og:description", content: "Coordonnées, livraison et préférences boutique." },
    ],
  }),
  component: SettingsAdmin,
});

function SettingsAdmin() {
  return (
    <DashboardLayout title="Paramètres">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          toast.success("Paramètres enregistrés.");
        }}
        className="max-w-2xl space-y-6 border border-border bg-card p-6"
      >
        <div>
          <Label htmlFor="shop-name">Nom de la boutique</Label>
          <Input id="shop-name" defaultValue="Maison Orée" className="mt-1.5 rounded-none" />
        </div>
        <div>
          <Label htmlFor="shop-email">E-mail de contact</Label>
          <Input
            id="shop-email"
            type="email"
            defaultValue="contact@maison-oree.com"
            className="mt-1.5 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="shop-desc">Description</Label>
          <Textarea
            id="shop-desc"
            rows={3}
            defaultValue="Boutique de prêt-à-porter multimarque, sélection premium."
            className="mt-1.5 rounded-none"
          />
        </div>
        <div>
          <Label htmlFor="shipping">Frais de livraison (FCFA)</Label>
          <Input id="shipping" type="number" defaultValue={2500} className="mt-1.5 rounded-none" />
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
          <div className="min-w-0">
            <p className="text-sm">Livraison offerte dès 50 000 FCFA</p>
            <p className="text-xs text-muted-foreground">Appliquée automatiquement au panier.</p>
          </div>
          <Switch defaultChecked className="shrink-0" />
        </div>
        <Button type="submit" className="rounded-none">
          Enregistrer
        </Button>
      </form>
    </DashboardLayout>
  );
}