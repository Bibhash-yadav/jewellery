import { useEffect, useState } from "react";
import { request } from "../api/client";

export default function AdminDashboard() {

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    request("/admin/analytics/dashboard")
      .then((data) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{stats.total_revenue}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {stats.total_orders}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Top Product</p>
          <h2 className="text-xl font-bold text-yellow-600">
            {stats.top_selling_products?.[0]?.name || "None"}
          </h2>
        </div>

      </div>

    </div>
  );
}