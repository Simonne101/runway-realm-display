import { createFileRoute } from "@tanstack/react-router";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductFormDialog } from "@/components/dashboard/ProductFormDialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatPrice, type Product } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/produits")({
  head: () => ({
    meta: [
      { title: "Gestion des produits — Administration Maison Orée" },
      {
        name: "description",
        content: "Ajoutez, modifiez, activez ou supprimez les produits du catalogue.",
      },
      { property: "og:title", content: "Gestion des produits — Administration" },
      { property: "og:description", content: "CRUD complet sur le catalogue produits." },
    ],
  }),
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const { products, brands, categories, deleteProduct, toggleProductStatus } = useStore();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [preview, setPreview] = useState<Product | null>(null);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const brandName = (id: string) => brands.find((brand) => brand.id === id)?.name ?? "—";
  const categoryName = (id: string) => categories.find((cat) => cat.id === id)?.name ?? "—";

  return (
    <DashboardLayout title="Produits">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher un produit…"
          className="h-10 max-w-sm rounded-none bg-card"
        />
        <Button
          className="h-10 shrink-0 rounded-none"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Marque</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actif</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-border/60">
                <td className="px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 shrink-0 object-cover"
                    />
                    <span className="truncate">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{brandName(product.brandId)}</td>
                <td className="px-4 py-3">{categoryName(product.categoryId)}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="rounded-none text-[10px] capitalize">
                    {product.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={product.status === "disponible"}
                    onCheckedChange={() => toggleProductStatus(product.id)}
                    aria-label="Activer le produit"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setPreview(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(product);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPendingDelete(product)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-16 text-center text-sm text-muted-foreground">
            Aucun produit ne correspond à cette recherche.
          </p>
        )}
      </div>

      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} product={editing} />

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} sera définitivement retiré du catalogue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              onClick={() => {
                if (pendingDelete) {
                  deleteProduct(pendingDelete.id);
                  toast.success("Produit supprimé.");
                }
                setPendingDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>{preview?.name}</AlertDialogTitle>
            <AlertDialogDescription>{preview?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          {preview && (
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Marque : {brandName(preview.brandId)}</p>
              <p>Catégorie : {categoryName(preview.categoryId)}</p>
              <p>Prix : {formatPrice(preview.price)}</p>
              <p>Tailles : {preview.sizes.join(", ")}</p>
              <p>Couleurs : {preview.colors.join(", ")}</p>
              <p>Stock : {preview.stock}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Fermer</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}