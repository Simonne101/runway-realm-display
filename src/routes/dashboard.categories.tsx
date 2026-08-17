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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMAGES, type Category } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/categories")({
  head: () => ({
    meta: [
      { title: "Gestion des catégories — Administration Maison Orée" },
      {
        name: "description",
        content: "Créez et modifiez les catégories affichées sur la boutique en ligne.",
      },
      { property: "og:title", content: "Gestion des catégories — Administration" },
      { property: "og:description", content: "Hommes, femmes, sneakers, accessoires et plus." },
    ],
  }),
  component: CategoriesAdmin,
});

const VISUALS = [
  { id: "catHommes", label: "Silhouette homme" },
  { id: "catFemmes", label: "Silhouette femme" },
  { id: "catStreetwear", label: "Streetwear" },
  { id: "catCasual", label: "Casual" },
  { id: "sneakers", label: "Sneakers" },
  { id: "accessories", label: "Accessoires" },
] as const;

function CategoriesAdmin() {
  const { categories, products, saveCategory, deleteCategory } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [visual, setVisual] = useState<string>("catHommes");

  useEffect(() => {
    if (!open) return;
    setName(editing?.name ?? "");
    setVisual("catHommes");
  }, [open, editing]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name) {
      toast.error("Le nom de la catégorie est requis.");
      return;
    }
    saveCategory({
      id: editing?.id ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      image: editing?.image ?? IMAGES[visual as keyof typeof IMAGES] ?? IMAGES.catHommes,
    });
    toast.success(editing ? "Catégorie mise à jour." : "Catégorie créée.");
    setOpen(false);
    setEditing(null);
  };

  return (
    <DashboardLayout title="Catégories">
      <div className="flex justify-end">
        <Button
          className="h-10 rounded-none"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter une catégorie
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="border border-border bg-card">
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-4">
              <div className="min-w-0">
                <h2 className="truncate text-sm">{category.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {products.filter((product) => product.categoryId === category.id).length} produits
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(category);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setPendingDelete(category)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</DialogTitle>
            <DialogDescription>Les catégories structurent la navigation boutique.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Nom</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 rounded-none"
              />
            </div>
            {!editing && (
              <div>
                <Label>Visuel</Label>
                <Select value={visual} onValueChange={setVisual}>
                  <SelectTrigger className="mt-1.5 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISUALS.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} disparaîtra de la navigation et des filtres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              onClick={() => {
                if (pendingDelete) {
                  deleteCategory(pendingDelete.id);
                  toast.success("Catégorie supprimée.");
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