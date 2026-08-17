import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ShoppingCart, Store, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { formatPrice, orders, salesData } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Administration Maison Orée" },
      {
        name: "description",
        content: "Suivi des ventes, des produits, des marques et des commandes de la boutique.",
      },
      { property: "og:title", content: "Tableau de bord — Administration Maison Orée" },
      { property: "og:description", content: "Statistiques et gestion du catalogue." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const { products, brands } = useStore();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const bestSellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
  const recent = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Produits" value={String(products.length)} icon={Package} hint="Catalogue actif" />
        <StatCard label="Marques" value={String(brands.length)} icon={Store} hint="Partenaires" />
        <StatCard label="Commandes" value={String(orders.length)} icon={ShoppingCart} hint="30 derniers jours" />
        <StatCard label="Chiffre d'affaires" value={formatPrice(revenue)} icon={TrendingUp} hint="Mois en cours" />
      </div>

      <div className="mt-6 border border-border bg-card p-5">
        <h2 className="text-sm uppercase tracking-[0.16em]">Évolution des ventes</h2>
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value: number) => `${value / 1000}k`}
              />
              <Tooltip formatter={(value: number) => formatPrice(value)} />
              <Bar dataKey="ventes" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="border border-border bg-card p-5">
          <h2 className="text-sm uppercase tracking-[0.16em]">Produits les plus vendus</h2>
          <ul className="mt-5 space-y-4">
            {bestSellers.map((product) => (
              <li key={product.id} className="flex min-w-0 items-center gap-3">
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-12 w-12 shrink-0 object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(product.price)}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{product.popularity}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm uppercase tracking-[0.16em]">Produits récents</h2>
            <Link to="/dashboard/produits" className="text-xs text-muted-foreground hover:text-foreground">
              Gérer
            </Link>
          </div>
          <ul className="mt-5 space-y-4">
            {recent.map((product) => (
              <li key={product.id} className="flex min-w-0 items-center gap-3">
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-12 w-12 shrink-0 object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">Ajouté le {product.createdAt}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 rounded-none text-[10px] capitalize">
                  {product.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border border-border bg-card p-5">
        <h2 className="text-sm uppercase tracking-[0.16em]">Dernières commandes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2 pr-4">Référence</th>
                <th className="py-2 pr-4">Client</th>
                <th className="py-2 pr-4">Articles</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">{order.id}</td>
                  <td className="py-3 pr-4">{order.customer}</td>
                  <td className="py-3 pr-4">{order.items}</td>
                  <td className="py-3 pr-4">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <Badge variant="secondary" className="rounded-none text-[10px]">
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}