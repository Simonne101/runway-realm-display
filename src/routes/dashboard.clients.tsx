import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { customers, formatPrice } from "@/data/catalog";

export const Route = createFileRoute("/dashboard/clients")({
  head: () => ({
    meta: [
      { title: "Clients — Administration Maison Orée" },
      { name: "description", content: "Consultez la liste des clients, leurs commandes et leur panier moyen." },
      { property: "og:title", content: "Clients — Administration" },
      { property: "og:description", content: "Base clients et historique d'achats." },
    ],
  }),
  component: CustomersAdmin,
});

function CustomersAdmin() {
  return (
    <DashboardLayout title="Clients">
      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Total dépensé</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border/60">
                <td className="px-4 py-3">{customer.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                <td className="px-4 py-3">{customer.orders}</td>
                <td className="px-4 py-3">{formatPrice(customer.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}