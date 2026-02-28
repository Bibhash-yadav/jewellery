import { useEffect, useState } from "react";
import { request } from "../api/client";

export default function MyOrders(){

  const [orders,setOrders]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [cancelLoading,setCancelLoading]=useState<number|null>(null);

  const loadOrders=()=>{
    request("/orders")
      .then(res=>{
        setOrders(Array.isArray(res)?res:[]);
        setLoading(false);
      })
      .catch(()=>{
        setOrders([]);
        setLoading(false);
      });
  };

  useEffect(()=>{ loadOrders(); },[]);

  const cancelOrder=async(id:number)=>{
    if(!confirm("Are you sure you want to cancel this order?")) return;

    try{
      setCancelLoading(id);
      await request(`/orders/${id}/cancel`,{method:"PATCH"});
      loadOrders();
    }finally{
      setCancelLoading(null);
    }
  };

  const steps=["Placed","Shipped","Delivered"];

  const getStep=(status:string)=>{
    const map:any={
      pending:1,
      shipped:2,
      delivered:3,
      cancelled:0
    };
    return map[status] || 1;
  };

  const statusColor=(status:string)=>{
    if(status==="delivered") return "text-green-400";
    if(status==="cancelled") return "text-red-400";
    if(status==="shipped") return "text-blue-400";
    return "text-yellow-400";
  };

  const paymentLabel=(order:any)=>{
    if(order.status==="delivered") return "Paid (COD)";
    return "Cash on Delivery";
  };

  if(loading)
    return (
      <div className="text-white bg-black min-h-screen pt-20 flex items-center justify-center">
        Loading orders...
      </div>
    );

  return(
    <div className="bg-black min-h-screen text-white pt-20 px-4 md:px-10 pb-10">

      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
        My Orders
      </h1>

      {orders.length===0 &&(
        <div className="text-center bg-gray-900 p-10 rounded-2xl max-w-2xl mx-auto">
          <p className="text-gray-400 text-lg">You have not placed any order yet</p>
        </div>
      )}

      <div className="space-y-10">

      {orders.map(order=>{

        const step=getStep(order.status);

        return(
          <div key={order.id} className="bg-gray-900 rounded-2xl p-6 shadow-lg">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-gray-700 pb-4">

              <div>
                <p className="text-lg font-semibold">Order #{order.id}</p>
                <p className={`text-sm ${statusColor(order.status)} capitalize`}>
                  {order.status}
                </p>
                <p className="text-xs text-gray-400">
                  {paymentLabel(order)}
                </p>
              </div>

              <div className="text-yellow-400 text-xl font-bold">
                ₹{order.total_amount}
              </div>

              {order.status!=="delivered" && order.status!=="cancelled" && (
                <button
                  onClick={()=>cancelOrder(order.id)}
                  disabled={cancelLoading===order.id}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl transition disabled:opacity-50"
                >
                  {cancelLoading===order.id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}

            </div>

            {/* PRODUCTS */}
            <div className="mt-6 space-y-4">
              {order.items?.map((item:any)=>(
                <div key={item.id} className="flex gap-4 items-center bg-gray-800 p-4 rounded-xl">

                  <img
                    src={item.product?.image_url || "/placeholder.png"}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.product?.title}</p>
                    <p className="text-gray-400 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-yellow-400 font-semibold">
                    ₹{item.price * item.quantity}
                  </div>

                </div>
              ))}
            </div>

            {/* TRACKING */}
            {order.status!=="cancelled" && (
            <div className="mt-8">

              <div className="flex items-center justify-between relative">

                <div className="absolute top-4 left-0 w-full h-1 bg-gray-700"/>
                <div
                  className="absolute top-4 left-0 h-1 bg-yellow-500 transition-all duration-500"
                  style={{width:`${(step-1)/(steps.length-1)*100}%`}}
                />

                {steps.map((label,i)=>{
                  const active=i+1<=step;

                  return(
                    <div key={i} className="flex-1 text-center relative">

                      <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center text-xs font-bold
                        ${active
                          ?"bg-yellow-500 border-yellow-500 text-black"
                          :"bg-gray-800 border-gray-600 text-gray-400"
                        }`}>
                        {i+1}
                      </div>

                      <p className={`mt-3 text-xs md:text-sm ${active?"text-white":"text-gray-500"}`}>
                        {label}
                      </p>

                    </div>
                  );
                })}

              </div>

            </div>
            )}

            {order.status==="cancelled" && (
              <p className="mt-6 text-red-400 font-semibold text-center">
                This order has been cancelled
              </p>
            )}

          </div>
        );
      })}

      </div>

    </div>
  );
}