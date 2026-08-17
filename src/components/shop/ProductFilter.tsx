import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/catalog";
import { useStore } from "@/lib/store";

const GENDERS = [
  { id: "homme", label: "Homme" },
  { id: "femme", label: "Femme" },
  { id: "unisexe", label: "Unisexe" },
];
const SIZES = ["S", "M", "L", "XL", "39", "40", "41", "42", "43", "44", "Unique"];
const COLORS = ["Noir", "Blanc", "Beige", "Gris", "Bleu", "Écru", "Marron"];

interface Props {
  selectedBrands: string[];
  selectedCategories: string[];
  genders: string[];
  sizes: string[];
  colors: string[];
  maxPrice: number;
  onBrands: (value: string[]) => void;
  onCategories: (value: string[]) => void;
  onGenders: (value: string[]) => void;
  onSizes: (value: string[]) => void;
  onColors: (value: string[]) => void;
  onMaxPrice: (value: number) => void;
  onReset: () => void;
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-6">
      <h3 className="eyebrow">{title}</h3>
      <div className="mt-4 space-y-2.5">{children}</div>
    </div>
  );
}

function Option({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} className="rounded-none" />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
        {label}
      </Label>
    </div>
  );
}

export function ProductFilter(props: Props) {
  const { brands, categories } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-[0.16em]">Filtres</h2>
        <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={props.onReset}>
          Réinitialiser
        </Button>
      </div>

      <Group title="Marque">
        {brands.map((brand) => (
          <Option
            key={brand.id}
            id={`brand-${brand.id}`}
            label={brand.name}
            checked={props.selectedBrands.includes(brand.id)}
            onChange={() => props.onBrands(toggle(props.selectedBrands, brand.id))}
          />
        ))}
      </Group>

      <Group title="Catégorie">
        {categories.map((category) => (
          <Option
            key={category.id}
            id={`cat-${category.id}`}
            label={category.name}
            checked={props.selectedCategories.includes(category.id)}
            onChange={() => props.onCategories(toggle(props.selectedCategories, category.id))}
          />
        ))}
      </Group>

      <Group title="Genre">
        {GENDERS.map((gender) => (
          <Option
            key={gender.id}
            id={`gender-${gender.id}`}
            label={gender.label}
            checked={props.genders.includes(gender.id)}
            onChange={() => props.onGenders(toggle(props.genders, gender.id))}
          />
        ))}
      </Group>

      <Group title="Taille">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => props.onSizes(toggle(props.sizes, size))}
              className={`min-w-10 border px-2.5 py-1.5 text-xs transition-colors ${
                props.sizes.includes(size)
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border hover:border-foreground"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Couleur">
        {COLORS.map((color) => (
          <Option
            key={color}
            id={`color-${color}`}
            label={color}
            checked={props.colors.includes(color)}
            onChange={() => props.onColors(toggle(props.colors, color))}
          />
        ))}
      </Group>

      <div>
        <h3 className="eyebrow">Prix maximum</h3>
        <Slider
          value={[props.maxPrice]}
          min={5000}
          max={120000}
          step={2500}
          onValueChange={(value) => props.onMaxPrice(value[0] ?? 120000)}
          className="mt-5"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Jusqu'à {formatPrice(props.maxPrice)}
        </p>
      </div>
    </div>
  );
}