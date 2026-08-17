import { createFileRoute } from "@tanstack/react-router";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { customers, formatPrice, orders, salesData } from "@/data/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard/statistiques")({
  head: () => ({
    meta: [
      { title: "Statistiques — Administration Maison Orée" },
      { name: "description", content: "Analysez l'évolution du chiffre d'affaires et du panier moyen." },
      { property: "og:title", content: "Statistiques — Administration" },
      { property: "og:description", content: "Tendances de ventes et indicateurs clés." },
    ],
  }),
  component: StatsAdmin,
});

function StatsAdmin() {
  const { products } = useStore();
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const average = Math.round(revenue / orders.length);

  return (
    <DashboardLayout title="Statistiques">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Chiffre d'affaires" value={formatPrice(revenue)} icon={TrendingUp} />
        <StatCard label="Panier moyen" value={formatPrice(average)} icon={ShoppingCart} />
        <StatCard label="Clients" value={String(customers.length)} icon={Users} />
        <StatCard label="Références" value={String(products.length)} icon={Package} />
      </div>

      <div className="mt-6 border border-border bg-card p-5">
        <h2 className="text-sm uppercase tracking-[0.16em]">Tendance mensuelle</h2>
        <div className="mt-6 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value: number) => `${value / 1000}k`}
              />
              <Tooltip formatter={(value: number) => formatPrice(value)} />
              <Line
                type="monotone"
                dataKey="ventes"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}