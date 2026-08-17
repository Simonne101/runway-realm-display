import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMAGES, type Brand } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/marques")({
  head: () => ({
    meta: [
      { title: "Gestion des marques — Administration Maison Orée" },
      {
        name: "description",
        content: "Ajoutez, modifiez et supprimez les marques mises en avant dans la boutique.",
      },
      { property: "og:title", content: "Gestion des marques — Administration" },
      { property: "og:description", content: "Logos, descriptions et images de couverture." },
    ],
  }),
  component: BrandsAdmin,
});

const COVERS = [
  { id: "catStreetwear", label: "Streetwear" },
  { id: "catFemmes", label: "Silhouette femme" },
  { id: "catHommes", label: "Silhouette homme" },
  { id: "catCasual", label: "Casual" },
  { id: "sneakers", label: "Sneakers" },
  { id: "accessories", label: "Accessoires" },
  { id: "denim", label: "Denim" },
] as const;

const EMPTY = { name: "", logoText: "", description: "", cover: "catStreetwear" };

function BrandsAdmin() {
  const { brands, products, saveBrand, deleteBrand } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Brand | null>(null);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            name: editing.name,
            logoText: editing.logoText,
            description: editing.description,
            cover: "catStreetwear",
          }
        : EMPTY,
    );
  }, [open, editing]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name) {
      toast.error("Le nom de la marque est requis.");
      return;
    }
    saveBrand({
      id: editing?.id ?? form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: form.name,
      logoText: form.logoText || form.name.slice(0, 2).toUpperCase(),
      description: form.description || "Marque partenaire de la boutique.",
      cover: editing?.cover ?? IMAGES[form.cover as keyof typeof IMAGES] ?? IMAGES.catStreetwear,
    });
    toast.success(editing ? "Marque mise à jour." : "Marque ajoutée.");
    setOpen(false);
    setEditing(null);
  };

  return (
    <DashboardLayout title="Marques">
      <div className="flex justify-end">
        <Button
          className="h-10 rounded-none"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une marque
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {brands.map((brand) => (
          <div key={brand.id} className="border border-border bg-card">
            <img
              src={brand.cover}
              alt={brand.name}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-xl">{brand.logoText}</p>
                  <h2 className="mt-1 truncate text-sm">{brand.name}</h2>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(brand);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setPendingDelete(brand)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {brand.description}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {products.filter((product) => product.brandId === brand.id).length} produits
              </p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la marque" : "Nouvelle marque"}</DialogTitle>
            <DialogDescription>Ces informations apparaissent sur la page d'accueil.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="brand-name">Nom</Label>
              <Input
                id="brand-name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="mt-1.5 rounded-none"
              />
            </div>
            <div>
              <Label htmlFor="brand-logo">Logo (initiales)</Label>
              <Input
                id="brand-logo"
                value={form.logoText}
                onChange={(event) => setForm({ ...form, logoText: event.target.value })}
                className="mt-1.5 rounded-none"
              />
            </div>
            {!editing && (
              <div>
                <Label>Image de couverture</Label>
                <Select value={form.cover} onValueChange={(value) => setForm({ ...form, cover: value })}>
                  <SelectTrigger className="mt-1.5 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COVERS.map((cover) => (
                      <SelectItem key={cover.id} value={cover.id}>
                        {cover.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="brand-desc">Description</Label>
              <Textarea
                id="brand-desc"
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="mt-1.5 rounded-none"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="rounded-none" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="rounded-none">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDelete)} onOpenChange={(value) => !value && setPendingDelete(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette marque ?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} ne sera plus proposée dans les filtres de la boutique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              onClick={() => {
                if (pendingDelete) {
                  deleteBrand(pendingDelete.id);
                  toast.success("Marque supprimée.");
                }
                setPendingDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}