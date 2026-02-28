import { useEffect, useRef, useState } from "react";
import { request } from "../api/client";
import {
  Package,
  IndianRupee,
  AlertTriangle,
  Users
} from "lucide-react";

type Stats = {
  total_revenue: number;
  total_orders: number;
  top_selling_products: any[];
};

export default function AdminDashboard() {

  const [stats, setStats] = useState<Stats>({
    total_revenue: 0,
    total_orders: 0,
    top_selling_products: []
  });

  const [lowStock, setLowStock] = useState<number>(0);
  const [latestOrders, setLatestOrders] = useState<any[]>([]);
  const [liveVisitors, setLiveVisitors] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // prevents double socket in React strict mode
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    loadDashboard();
    connectSocket();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  // ---------------- LOAD INITIAL DATA ----------------
  async function loadDashboard() {
    try {
      const dashboard = await request("/admin/analytics/dashboard");

      setStats({
        total_revenue: dashboard?.total_revenue || 0,
        total_orders: dashboard?.total_orders || 0,
        top_selling_products: dashboard?.top_selling_products || []
      });

      const products = await request("/products");
      const low = (products || []).filter((p: any) => p.stock <= 5);
      setLowStock(low.length);

      const orders = await request("/admin/orders");
      setLatestOrders((orders || []).slice(0, 5));

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------- REALTIME SOCKET ----------------
  function connectSocket() {
    if (socketRef.current) return; // avoid double connect

    const token = localStorage.getItem("token");
    if (!token) return;

    const WS_URL = import.meta.env.VITE_WS_URL;

    try {
      const ws = new WebSocket(`${WS_URL}/ws/notifications?token=${token}`);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 🆕 New Order
        if (data.type === "NEW_ORDER") {
          setLatestOrders(prev => [
            {
              id: data.order_id,
              user: { name: data.customer },
              total_amount: data.amount
            },
            ...prev
          ]);

          setStats(prev => ({
            total_revenue: prev?.total_revenue || 0,
            total_orders: (prev?.total_orders || 0) + 1,
            top_selling_products: prev?.top_selling_products || []
          }));
        }

        // 💰 Revenue Update
        if (data.type === "REVENUE_UPDATE") {
          setStats(prev => ({
            total_revenue: (prev?.total_revenue || 0) + (data.amount || 0),
            total_orders: prev?.total_orders || 0,
            top_selling_products: prev?.top_selling_products || []
          }));
        }

        // 👥 Live visitors
        if (data.type === "VISITORS") {
          setLiveVisitors(data.count || 0);
        }
      };

      ws.onclose = () => {
        socketRef.current = null;
        setTimeout(connectSocket, 4000); // auto reconnect
      };

    } catch (err) {
      console.error("WebSocket error:", err);
    }
  }

  if (loading) {
    return <div className="text-gray-600 text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">
        Admin Command Center
      </h1>

      {/* ---------- STATS CARDS ---------- */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Revenue"
          value={`₹${Number(stats.total_revenue).toLocaleString()}`}
          icon={<IndianRupee className="text-green-500" size={32}/>}
        />

        <StatCard
          title="Total Orders"
          value={stats.total_orders}
          icon={<Package className="text-blue-500" size={32}/>}
        />

        <StatCard
          title="Low Stock Items"
          value={lowStock}
          icon={<AlertTriangle className="text-red-500" size={32}/>}
        />

        <StatCard
          title="Live Visitors"
          value={liveVisitors}
          icon={<Users className="text-purple-500" size={32}/>}
        />

      </div>

      {/* ---------- LATEST ORDERS ---------- */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-bold mb-6">
          Latest Orders
        </h2>

        {latestOrders.length === 0 ? (
          <p className="text-gray-400">No recent orders</p>
        ) : (
          <div className="space-y-4">
            {latestOrders.map((order: any, i: number) => (
              <div key={i} className="flex justify-between bg-gray-50 px-4 py-3 rounded-xl">
                <span>
                  #{order.id} — {order.user?.name}
                </span>
                <span className="text-green-600 font-semibold">
                  ₹{order.total_amount}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ---------- TOP SELLING ---------- */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-xl font-bold mb-6">
          Top Selling Products
        </h2>

        {stats.top_selling_products.length === 0 ? (
          <p className="text-gray-400">No sales yet</p>
        ) : (
          <div className="space-y-4">
            {stats.top_selling_products.map((p: any, i: number) => (
              <div key={i} className="flex justify-between bg-gray-50 px-4 py-3 rounded-xl">
                <span>{p.name}</span>
                <span className="text-yellow-600 font-semibold">
                  {p.sold} sold
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}


// ---------- REUSABLE CARD ----------
function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center hover:shadow-lg transition">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </div>
      {icon}
    </div>
  );
}