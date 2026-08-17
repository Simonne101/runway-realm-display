import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  brands as seedBrands,
  categories as seedCategories,
  products as seedProducts,
  type Brand,
  type Category,
  type Product,
} from "@/data/catalog";

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

interface StoreValue {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  hydrated: boolean;
  addToCart: (item: Omit<CartItem, "key">) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  saveBrand: (brand: Brand) => void;
  deleteBrand: (id: string) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const KEYS = {
  cart: "boutique.cart",
  products: "boutique.products",
  brands: "boutique.brands",
  categories: "boutique.categories",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode */
  }
}

export const SHIPPING_FEE = 2500;
export const FREE_SHIPPING_THRESHOLD = 50000;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [brands, setBrands] = useState<Brand[]>(seedBrands);
  const [categories, setCategories] = useState<Category[]>(seedCategories);

  useEffect(() => {
    setCart(read<CartItem[]>(KEYS.cart, []));
    setProducts(read<Product[]>(KEYS.products, seedProducts));
    setBrands(read<Brand[]>(KEYS.brands, seedBrands));
    setCategories(read<Category[]>(KEYS.categories, seedCategories));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(KEYS.cart, cart);
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEYS.products, products);
  }, [products, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEYS.brands, brands);
  }, [brands, hydrated]);
  useEffect(() => {
    if (hydrated) write(KEYS.categories, categories);
  }, [categories, hydrated]);

  const addToCart = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.productId}|${item.size}|${item.color}`;
    setCart((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key ? { ...line, quantity: line.quantity + item.quantity } : line,
        );
      }
      return [...current, { ...item, key }];
    });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setCart((current) =>
      quantity <= 0
        ? current.filter((line) => line.key !== key)
        : current.map((line) => (line.key === key ? { ...line, quantity } : line)),
    );
  }, []);

  const removeFromCart = useCallback(
    (key: string) => setCart((current) => current.filter((line) => line.key !== key)),
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const saveProduct = useCallback((product: Product) => {
    setProducts((current) =>
      current.some((p) => p.id === product.id)
        ? current.map((p) => (p.id === product.id ? product : p))
        : [product, ...current],
    );
  }, []);

  const deleteProduct = useCallback(
    (id: string) => setProducts((current) => current.filter((p) => p.id !== id)),
    [],
  );

  const toggleProductStatus = useCallback((id: string) => {
    setProducts((current) =>
      current.map((p) =>
        p.id === id ? { ...p, status: p.status === "disponible" ? "brouillon" : "disponible" } : p,
      ),
    );
  }, []);

  const saveBrand = useCallback((brand: Brand) => {
    setBrands((current) =>
      current.some((b) => b.id === brand.id)
        ? current.map((b) => (b.id === brand.id ? brand : b))
        : [...current, brand],
    );
  }, []);

  const deleteBrand = useCallback(
    (id: string) => setBrands((current) => current.filter((b) => b.id !== id)),
    [],
  );

  const saveCategory = useCallback((category: Category) => {
    setCategories((current) =>
      current.some((c) => c.id === category.id)
        ? current.map((c) => (c.id === category.id ? category : c))
        : [...current, category],
    );
  }, []);

  const deleteCategory = useCallback(
    (id: string) => setCategories((current) => current.filter((c) => c.id !== id)),
    [],
  );

  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  const value = useMemo<StoreValue>(
    () => ({
      products,
      brands,
      categories,
      cart,
      cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      saveProduct,
      deleteProduct,
      toggleProductStatus,
      saveBrand,
      deleteBrand,
      saveCategory,
      deleteCategory,
    }),
    [
      products,
      brands,
      categories,
      cart,
      subtotal,
      shipping,
      hydrated,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      saveProduct,
      deleteProduct,
      toggleProductStatus,
      saveBrand,
      deleteBrand,
      saveCategory,
      deleteCategory,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}