import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { formatPrice, orders } from "@/data/catalog";

export const Route = createFileRoute("/dashboard/commandes")({
  head: () => ({
    meta: [
      { title: "Commandes — Administration Maison Orée" },
      { name: "description", content: "Suivez les commandes récentes de la boutique et leur statut." },
      { property: "og:title", content: "Commandes — Administration" },
      { property: "og:description", content: "Liste des commandes, montants et statuts." },
    ],
  }),
  component: OrdersAdmin,
});

function OrdersAdmin() {
  return (
    <DashboardLayout title="Commandes">
      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/60">
                <td className="px-4 py-3">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-4 py-3">{order.items}</td>
                <td className="px-4 py-3">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="rounded-none text-[10px]">
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}