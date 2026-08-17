import tshirt from "@/assets/p-tshirt.jpg";
import sneakers from "@/assets/p-sneakers.jpg";
import denim from "@/assets/p-denim.jpg";
import outerwear from "@/assets/p-outerwear.jpg";
import accessories from "@/assets/p-accessories.jpg";
import catHommes from "@/assets/cat-hommes.jpg";
import catFemmes from "@/assets/cat-femmes.jpg";
import catStreetwear from "@/assets/cat-streetwear.jpg";
import catCasual from "@/assets/cat-casual.jpg";
import editorial from "@/assets/editorial.jpg";

export const IMAGES = {
  tshirt,
  sneakers,
  denim,
  outerwear,
  accessories,
  catHommes,
  catFemmes,
  catStreetwear,
  catCasual,
  editorial,
};

export type ProductStatus = "disponible" | "rupture" | "brouillon";

export interface Brand {
  id: string;
  name: string;
  description: string;
  logoText: string;
  cover: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  categoryId: string;
  gender: "homme" | "femme" | "unisexe";
  price: number;
  oldPrice?: number;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  status: ProductStatus;
  badge?: string;
  popularity: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  items: number;
  status: "Livrée" | "En cours" | "En attente";
  date: string;
}

export const brands: Brand[] = [
  {
    id: "urban-label",
    name: "Urban Label",
    description: "Streetwear premium, coupes oversized et matières lourdes.",
    logoText: "UL",
    cover: catStreetwear,
  },
  {
    id: "maison-nord",
    name: "Maison Nord",
    description: "Tailoring minimaliste inspiré des ateliers scandinaves.",
    logoText: "MN",
    cover: catFemmes,
  },
  {
    id: "atelier-douze",
    name: "Atelier Douze",
    description: "Pièces essentielles confectionnées en petites séries.",
    logoText: "A12",
    cover: catCasual,
  },
  {
    id: "verso",
    name: "Verso",
    description: "Denim contemporain et basiques travaillés.",
    logoText: "VS",
    cover: denim,
  },
  {
    id: "kora-sport",
    name: "Kora Sport",
    description: "Sneakers et vêtements techniques du quotidien.",
    logoText: "KS",
    cover: sneakers,
  },
  {
    id: "lumen-co",
    name: "Lumen & Co",
    description: "Accessoires en cuir et finitions soignées.",
    logoText: "L&C",
    cover: accessories,
  },
];

export const categories: Category[] = [
  { id: "hommes", name: "Hommes", image: catHommes },
  { id: "femmes", name: "Femmes", image: catFemmes },
  { id: "sneakers", name: "Sneakers", image: sneakers },
  { id: "accessoires", name: "Accessoires", image: accessories },
  { id: "streetwear", name: "Streetwear", image: catStreetwear },
  { id: "casual", name: "Casual", image: catCasual },
];

const CLOTHING_SIZES = ["S", "M", "L", "XL"];
const SHOE_SIZES = ["39", "40", "41", "42", "43", "44"];

export const products: Product[] = [
  {
    id: "p1",
    name: "Premium Oversized T-Shirt",
    brandId: "urban-label",
    categoryId: "streetwear",
    gender: "unisexe",
    price: 18500,
    oldPrice: 24000,
    description:
      "Un t-shirt oversized en coton peigné 240g, épaules tombantes et col renforcé. La pièce socle de toutes vos tenues.",
    images: [tshirt, catStreetwear],
    sizes: CLOTHING_SIZES,
    colors: ["Noir", "Blanc", "Beige"],
    stock: 42,
    status: "disponible",
    badge: "Nouveau",
    popularity: 96,
    createdAt: "2026-08-01",
  },
  {
    id: "p2",
    name: "Sneakers Minimal Court",
    brandId: "kora-sport",
    categoryId: "sneakers",
    gender: "unisexe",
    price: 46000,
    description:
      "Sneakers basses en cuir pleine fleur, semelle en gomme et doublure respirante. Silhouette épurée, confort quotidien.",
    images: [sneakers, catCasual],
    sizes: SHOE_SIZES,
    colors: ["Blanc", "Noir"],
    stock: 18,
    status: "disponible",
    badge: "Nouveau",
    popularity: 92,
    createdAt: "2026-07-28",
  },
  {
    id: "p3",
    name: "Trench Coat Structuré",
    brandId: "maison-nord",
    categoryId: "femmes",
    gender: "femme",
    price: 89000,
    oldPrice: 105000,
    description:
      "Trench en gabardine de coton déperlante, ceinture à nouer et coupe longue fluide. Une pièce de saison intemporelle.",
    images: [denim, catFemmes],
    sizes: CLOTHING_SIZES,
    colors: ["Beige", "Noir"],
    stock: 9,
    status: "disponible",
    badge: "Nouveau",
    popularity: 88,
    createdAt: "2026-07-25",
  },
  {
    id: "p4",
    name: "Hoodie Heavy Cotton",
    brandId: "urban-label",
    categoryId: "streetwear",
    gender: "unisexe",
    price: 32500,
    description:
      "Sweat à capuche en molleton gratté 400g, capuche doublée et poche kangourou. Chaud sans être rigide.",
    images: [outerwear, catStreetwear],
    sizes: CLOTHING_SIZES,
    colors: ["Gris", "Noir"],
    stock: 27,
    status: "disponible",
    badge: "Nouveau",
    popularity: 90,
    createdAt: "2026-07-22",
  },
  {
    id: "p5",
    name: "Jean Straight Selvedge",
    brandId: "verso",
    categoryId: "hommes",
    gender: "homme",
    price: 39500,
    oldPrice: 45000,
    description:
      "Jean droit en denim selvedge 13oz, délavage moyen et braguette boutonnée. Se patine avec le temps.",
    images: [denim, catHommes],
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Bleu", "Noir"],
    stock: 33,
    status: "disponible",
    popularity: 84,
    createdAt: "2026-07-18",
  },
  {
    id: "p6",
    name: "Blazer Croisé Sable",
    brandId: "maison-nord",
    categoryId: "femmes",
    gender: "femme",
    price: 72000,
    description:
      "Blazer croisé en laine mélangée, épaules nettes et taille marquée. Se porte ouvert ou fermé.",
    images: [catFemmes, editorial],
    sizes: CLOTHING_SIZES,
    colors: ["Beige", "Noir"],
    stock: 12,
    status: "disponible",
    popularity: 78,
    createdAt: "2026-07-15",
  },
  {
    id: "p7",
    name: "Ceinture Cuir Tressé",
    brandId: "lumen-co",
    categoryId: "accessoires",
    gender: "unisexe",
    price: 14500,
    description:
      "Ceinture en cuir de vachette tanné, boucle acier brossé. Finitions cousues main.",
    images: [accessories, catHommes],
    sizes: ["80", "85", "90", "95"],
    colors: ["Marron", "Noir"],
    stock: 54,
    status: "disponible",
    popularity: 66,
    createdAt: "2026-07-12",
  },
  {
    id: "p8",
    name: "Casquette Twill Noire",
    brandId: "lumen-co",
    categoryId: "accessoires",
    gender: "unisexe",
    price: 9500,
    description: "Casquette en twill de coton, visière préformée et fermeture ajustable.",
    images: [accessories, catStreetwear],
    sizes: ["Unique"],
    colors: ["Noir"],
    stock: 61,
    status: "disponible",
    popularity: 58,
    createdAt: "2026-07-10",
  },
  {
    id: "p9",
    name: "Bomber Technique",
    brandId: "kora-sport",
    categoryId: "hommes",
    gender: "homme",
    price: 58000,
    oldPrice: 66000,
    description:
      "Bomber en nylon mat déperlant, bords côtes contrastés et doublure légère. Silhouette droite.",
    images: [outerwear, catHommes],
    sizes: CLOTHING_SIZES,
    colors: ["Noir", "Gris"],
    stock: 15,
    status: "disponible",
    popularity: 81,
    createdAt: "2026-07-08",
  },
  {
    id: "p10",
    name: "Pull Torsadé Écru",
    brandId: "atelier-douze",
    categoryId: "casual",
    gender: "unisexe",
    price: 42000,
    description:
      "Pull col roulé en maille torsadée, laine mélangée douce. Chaleur et tenue sans volume excessif.",
    images: [catCasual, editorial],
    sizes: CLOTHING_SIZES,
    colors: ["Écru", "Beige"],
    stock: 21,
    status: "disponible",
    popularity: 74,
    createdAt: "2026-07-05",
  },
  {
    id: "p11",
    name: "Chino Plissé Ivoire",
    brandId: "atelier-douze",
    categoryId: "casual",
    gender: "homme",
    price: 29500,
    description: "Pantalon chino en coton lourd, pinces devant et tombé droit sur la cheville.",
    images: [catCasual, catHommes],
    sizes: ["28", "30", "32", "34"],
    colors: ["Écru", "Beige", "Noir"],
    stock: 26,
    status: "disponible",
    popularity: 69,
    createdAt: "2026-07-02",
  },
  {
    id: "p12",
    name: "T-Shirt Coton Bio Blanc",
    brandId: "atelier-douze",
    categoryId: "casual",
    gender: "unisexe",
    price: 12500,
    description: "T-shirt coupe droite en coton biologique 180g, col rond souple.",
    images: [tshirt, catCasual],
    sizes: CLOTHING_SIZES,
    colors: ["Blanc", "Noir", "Gris"],
    stock: 88,
    status: "disponible",
    popularity: 87,
    createdAt: "2026-06-28",
  },
  {
    id: "p13",
    name: "Veste en Jean Brute",
    brandId: "verso",
    categoryId: "streetwear",
    gender: "unisexe",
    price: 47500,
    description: "Veste en denim brut non délavé, coupe boxy et poches poitrine plaquées.",
    images: [denim, catStreetwear],
    sizes: CLOTHING_SIZES,
    colors: ["Bleu"],
    stock: 0,
    status: "rupture",
    popularity: 71,
    createdAt: "2026-06-24",
  },
  {
    id: "p14",
    name: "Runner Mesh Léger",
    brandId: "kora-sport",
    categoryId: "sneakers",
    gender: "unisexe",
    price: 52000,
    description: "Sneakers running en mesh respirant, semelle amortissante et tige sans couture.",
    images: [sneakers, catStreetwear],
    sizes: SHOE_SIZES,
    colors: ["Blanc", "Gris"],
    stock: 20,
    status: "disponible",
    popularity: 83,
    createdAt: "2026-06-20",
  },
  {
    id: "p15",
    name: "Robe Chemise Fluide",
    brandId: "maison-nord",
    categoryId: "femmes",
    gender: "femme",
    price: 54000,
    description: "Robe chemise en viscose fluide, ceinture amovible et manches longues.",
    images: [catFemmes, editorial],
    sizes: CLOTHING_SIZES,
    colors: ["Noir", "Beige"],
    stock: 14,
    status: "disponible",
    popularity: 76,
    createdAt: "2026-06-16",
  },
  {
    id: "p16",
    name: "Sweat Crewneck Gris",
    brandId: "urban-label",
    categoryId: "casual",
    gender: "unisexe",
    price: 27500,
    description: "Sweat col rond en molleton doux, poignets côtelés et coupe légèrement ample.",
    images: [outerwear, catCasual],
    sizes: CLOTHING_SIZES,
    colors: ["Gris", "Noir"],
    stock: 35,
    status: "disponible",
    popularity: 79,
    createdAt: "2026-06-12",
  },
  {
    id: "p17",
    name: "Lunettes Solaires Acétate",
    brandId: "lumen-co",
    categoryId: "accessoires",
    gender: "unisexe",
    price: 21500,
    oldPrice: 26000,
    description: "Monture en acétate poli, verres traités anti-reflet catégorie 3.",
    images: [accessories, editorial],
    sizes: ["Unique"],
    colors: ["Noir"],
    stock: 40,
    status: "disponible",
    popularity: 62,
    createdAt: "2026-06-08",
  },
  {
    id: "p18",
    name: "Pantalon Cargo Ample",
    brandId: "urban-label",
    categoryId: "streetwear",
    gender: "unisexe",
    price: 34500,
    description: "Cargo en coton ripstop, poches latérales à rabat et bas resserré par cordon.",
    images: [catStreetwear, denim],
    sizes: CLOTHING_SIZES,
    colors: ["Noir", "Beige"],
    stock: 23,
    status: "disponible",
    popularity: 80,
    createdAt: "2026-06-04",
  },
  {
    id: "p19",
    name: "Chemise Popeline Nette",
    brandId: "maison-nord",
    categoryId: "hommes",
    gender: "homme",
    price: 31500,
    description: "Chemise en popeline de coton, col italien et coupe ajustée sans rigidité.",
    images: [catHommes, editorial],
    sizes: CLOTHING_SIZES,
    colors: ["Blanc", "Bleu"],
    stock: 30,
    status: "disponible",
    popularity: 72,
    createdAt: "2026-05-30",
  },
  {
    id: "p20",
    name: "Manteau Laine Longue",
    brandId: "atelier-douze",
    categoryId: "femmes",
    gender: "femme",
    price: 118000,
    description: "Manteau long en laine mélangée, revers crantés et doublure satinée.",
    images: [editorial, catFemmes],
    sizes: CLOTHING_SIZES,
    colors: ["Noir", "Beige"],
    stock: 6,
    status: "brouillon",
    popularity: 68,
    createdAt: "2026-05-24",
  },
];

export const orders: Order[] = [
  { id: "CMD-1042", customer: "Awa Diallo", total: 64500, items: 3, status: "Livrée", date: "16/08/2026" },
  { id: "CMD-1041", customer: "Yann Kouassi", total: 46000, items: 1, status: "En cours", date: "15/08/2026" },
  { id: "CMD-1040", customer: "Fatou Ndiaye", total: 132000, items: 2, status: "En cours", date: "14/08/2026" },
  { id: "CMD-1039", customer: "Ibrahim Traoré", total: 27500, items: 1, status: "Livrée", date: "13/08/2026" },
  { id: "CMD-1038", customer: "Léa Mensah", total: 89000, items: 2, status: "En attente", date: "12/08/2026" },
];

export const salesData = [
  { month: "Fév", ventes: 1250000 },
  { month: "Mar", ventes: 1680000 },
  { month: "Avr", ventes: 1420000 },
  { month: "Mai", ventes: 2050000 },
  { month: "Juin", ventes: 2380000 },
  { month: "Juil", ventes: 2160000 },
  { month: "Août", ventes: 2890000 },
];

export const customers = [
  { id: "c1", name: "Awa Diallo", email: "awa.diallo@mail.com", orders: 7, spent: 412000 },
  { id: "c2", name: "Yann Kouassi", email: "yann.k@mail.com", orders: 4, spent: 186500 },
  { id: "c3", name: "Fatou Ndiaye", email: "fatou.n@mail.com", orders: 9, spent: 634000 },
  { id: "c4", name: "Ibrahim Traoré", email: "ibrahim.t@mail.com", orders: 2, spent: 74500 },
  { id: "c5", name: "Léa Mensah", email: "lea.mensah@mail.com", orders: 5, spent: 298000 },
];

export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("fr-FR").format(Math.round(value))} FCFA`;