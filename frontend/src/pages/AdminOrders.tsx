import { useEffect, useState } from "react";
import { request } from "../api/client";

const statusColors:any = {
  pending: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400"
};

const flow:any={
  pending:["shipped","cancelled"],
  shipped:["delivered"],
  delivered:[],
  cancelled:[]
};

export default function AdminOrders() {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    const res = await request("/admin/orders");
    setOrders(Array.isArray(res) ? res : []);
    setLoading(false);
  }

  async function changeStatus(orderId:number,newStatus:string){
    setUpdating(orderId);
    await request(`/admin/orders/${orderId}/status?status=${newStatus}`,{method:"PATCH"});
    await loadOrders();
    setUpdating(null);
  }

  if (loading)
    return <div className="p-10 text-black">Loading orders...</div>;

  return (
    <div className="p-6 text-black">

      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      <div className="space-y-8">

        {orders.map(order => (

          <div key={order.id} className="bg-white rounded-2xl p-6 border shadow-lg">

            {/* HEADER */}
            <div className="flex justify-between mb-6">

              <div>
                <p className="text-lg font-bold">Order #{order.id}</p>
                <p className="text-gray-600 text-sm">
                  {order.user?.name} • {order.user?.email}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ₹{Number(order.total_amount).toLocaleString()}
                </p>

                <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[order.status]}`}>
                  {order.status}
                </span>

                <p className="text-xs mt-1">
                  Payment:
                  <span className={`ml-1 font-semibold ${
                    order.payment_status==="success"
                      ?"text-green-600"
                      :"text-yellow-600"
                  }`}>
                    {order.payment_status}
                  </span>
                </p>
              </div>

            </div>

            {/* PRODUCTS FULL DETAILS */}
            <div className="border-t pt-4 space-y-4">

              {order.items?.map((item:any)=>(

                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl items-center">

                  <img
                    src={item.product?.image_url}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      {item.product?.title}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Unit Price: ₹{item.price}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-gray-400 text-xs">
                      Product ID: {item.product?.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ₹{Number(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                </div>

              ))}

            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex gap-3 flex-wrap">

              {flow[order.status].map((s:string)=>(
                <button
                  key={s}
                  disabled={updating===order.id}
                  onClick={()=>changeStatus(order.id,s)}
                  className="px-4 py-2 rounded-xl border hover:bg-black hover:text-white transition"
                >
                  {updating===order.id ? "Updating..." : `Mark ${s}`}
                </button>
              ))}

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}