import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { IMAGES, type Product, type ProductStatus } from "@/data/catalog";
import { useStore } from "@/lib/store";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const IMAGE_OPTIONS = [
  { id: "tshirt", label: "T-shirts" },
  { id: "sneakers", label: "Sneakers" },
  { id: "denim", label: "Denim / trench" },
  { id: "outerwear", label: "Sweats / vestes" },
  { id: "accessories", label: "Accessoires" },
  { id: "catFemmes", label: "Silhouette femme" },
  { id: "catHommes", label: "Silhouette homme" },
  { id: "catStreetwear", label: "Streetwear" },
  { id: "catCasual", label: "Casual" },
] as const;

const EMPTY = {
  name: "",
  brandId: "",
  categoryId: "",
  gender: "unisexe",
  price: "",
  oldPrice: "",
  description: "",
  image: "tshirt",
  sizes: "S, M, L, XL",
  colors: "Noir, Blanc",
  stock: "10",
  status: "disponible" as ProductStatus,
  badge: "",
};

export function ProductFormDialog({ open, onOpenChange, product }: Props) {
  const { brands, categories, saveProduct } = useStore();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        name: product.name,
        brandId: product.brandId,
        categoryId: product.categoryId,
        gender: product.gender,
        price: String(product.price),
        oldPrice: product.oldPrice ? String(product.oldPrice) : "",
        description: product.description,
        image: "tshirt",
        sizes: product.sizes.join(", "),
        colors: product.colors.join(", "),
        stock: String(product.stock),
        status: product.status,
        badge: product.badge ?? "",
      });
    } else {
      setForm({ ...EMPTY, brandId: brands[0]?.id ?? "", categoryId: categories[0]?.id ?? "" });
    }
  }, [open, product, brands, categories]);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.brandId || !form.categoryId || !form.price) {
      toast.error("Merci de renseigner le nom, la marque, la catégorie et le prix.");
      return;
    }
    const picked = IMAGES[form.image as keyof typeof IMAGES] ?? IMAGES.tshirt;
    const next: Product = {
      id: product?.id ?? `p-${Date.now()}`,
      name: form.name,
      brandId: form.brandId,
      categoryId: form.categoryId,
      gender: form.gender as Product["gender"],
      price: Number(form.price),
      description: form.description || "Description à compléter.",
      images: product ? product.images : [picked, IMAGES.editorial],
      sizes: form.sizes.split(",").map((size) => size.trim()).filter(Boolean),
      colors: form.colors.split(",").map((color) => color.trim()).filter(Boolean),
      stock: Number(form.stock) || 0,
      status: form.status,
      popularity: product?.popularity ?? 50,
      createdAt: product?.createdAt ?? new Date().toISOString().slice(0, 10),
      ...(form.oldPrice ? { oldPrice: Number(form.oldPrice) } : {}),
      ...(form.badge ? { badge: form.badge } : {}),
    };
    saveProduct(next);
    toast.success(product ? "Produit mis à jour." : "Produit ajouté au catalogue.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product ? "Modifier le produit" : "Nouveau produit"}</DialogTitle>
          <DialogDescription>
            Renseignez les informations affichées sur la fiche produit.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              className="mt-1.5 rounded-none"
            />
          </div>

          <div>
            <Label>Marque</Label>
            <Select value={form.brandId} onValueChange={(value) => set("brandId", value)}>
              <SelectTrigger className="mt-1.5 rounded-none">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Catégorie</Label>
            <Select value={form.categoryId} onValueChange={(value) => set("categoryId", value)}>
              <SelectTrigger className="mt-1.5 rounded-none">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Genre</Label>
            <Select value={form.gender} onValueChange={(value) => set("gender", value)}>
              <SelectTrigger className="mt-1.5 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homme">Homme</SelectItem>
                <SelectItem value="femme">Femme</SelectItem>
                <SelectItem value="unisexe">Unisexe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Statut</Label>
            <Select value={form.status} onValueChange={(value) => set("status", value)}>
              <SelectTrigger className="mt-1.5 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="rupture">Rupture de stock</SelectItem>
                <SelectItem value="brouillon">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="price">Prix (FCFA)</Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={(event) => set("price", event.target.value)}
              className="mt-1.5 rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="oldPrice">Ancien prix (optionnel)</Label>
            <Input
              id="oldPrice"
              type="number"
              value={form.oldPrice}
              onChange={(event) => set("oldPrice", event.target.value)}
              className="mt-1.5 rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={form.stock}
              onChange={(event) => set("stock", event.target.value)}
              className="mt-1.5 rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="badge">Badge (optionnel)</Label>
            <Input
              id="badge"
              value={form.badge}
              onChange={(event) => set("badge", event.target.value)}
              placeholder="Nouveau"
              className="mt-1.5 rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="sizes">Tailles (séparées par des virgules)</Label>
            <Input
              id="sizes"
              value={form.sizes}
              onChange={(event) => set("sizes", event.target.value)}
              className="mt-1.5 rounded-none"
            />
          </div>

          <div>
            <Label htmlFor="colors">Couleurs (séparées par des virgules)</Label>
            <Input
              id="colors"
              value={form.colors}
              onChange={(event) => set("colors", event.target.value)}
              className="mt-1.5 rounded-none"
            />
          </div>

          {!product && (
            <div className="sm:col-span-2">
              <Label>Visuel</Label>
              <Select value={form.image} onValueChange={(value) => set("image", value)}>
                <SelectTrigger className="mt-1.5 rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              rows={4}
              className="mt-1.5 rounded-none"
            />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" className="rounded-none">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}