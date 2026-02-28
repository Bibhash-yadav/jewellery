import { useEffect, useState } from "react";
import { getMyOrders } from "../api/order";
import { request } from "../api/client";

const steps = ["pending","shipped","delivered"];

export default function OrdersPage(){

  const [orders,setOrders]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [returning,setReturning]=useState<number|null>(null);

  useEffect(()=>{
    loadOrders();
  },[]);

  async function loadOrders(){
    setLoading(true);
    try{
      const res = await getMyOrders();
      setOrders(res||[]);
    }finally{
      setLoading(false);
    }
  }

  // STEP INDEX
  const getStepIndex=(status:string)=>{
    if(status==="cancelled") return -1;
    return Math.max(0,steps.indexOf(status));
  };

  // PAYMENT LABEL
  const paymentLabel=(order:any)=>{
    if(order.payment_status==="refunded") return "Refunded";
    if(order.payment_status==="success") return "Paid";
    return "Cash on Delivery";
  }

  const paymentColor=(order:any)=>{
    if(order.payment_status==="refunded") return "text-red-600";
    if(order.payment_status==="success") return "text-green-600";
    return "text-yellow-600";
  }

  // RETURN REQUEST
  async function requestReturn(orderId:number){
    try{
      setReturning(orderId);
      await request(`/orders/${orderId}/return`,{ method:"POST" });
      await loadOrders();
    }catch{
      alert("Return request failed");
    }finally{
      setReturning(null);
    }
  }

  const canReturn=(order:any)=>{
    return order.status==="delivered" && order.payment_status!=="refunded";
  }

  if(loading)
    return <div className="pt-28 text-center">Loading orders...</div>;

  if(!orders.length)
    return(
      <div className="pt-28 text-center text-gray-500">
        You haven't placed any orders yet
      </div>
    );

  return(
    <div className="pt-28 max-w-5xl mx-auto px-4 sm:px-6 space-y-10">

      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.map(order=>{

        const currentStep = getStepIndex(order.status);

        return(
        <div key={order.id} className="bg-white shadow-lg rounded-2xl p-5 sm:p-6">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-6">

            <div>
              <p className="font-semibold text-lg">
                Order #{order.id}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-yellow-600">
                ₹{Number(order.total_amount).toLocaleString()}
              </p>

              <p className="text-sm capitalize">
                Payment:
                <span className={`ml-1 font-semibold ${paymentColor(order)}`}>
                  {paymentLabel(order)}
                </span>
              </p>
            </div>

          </div>

          {/* PROGRESS TRACKER */}
          <div className="flex justify-between items-center mb-6">

            {steps.map((step,i)=>(

              <div key={step} className="flex-1 flex flex-col items-center relative">

                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                  ${
                    currentStep===-1
                      ? "bg-red-500"
                      : i<=currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}>
                  {i+1}
                </div>

                <p className="text-xs mt-2 capitalize">
                  {step==="pending" && "Placed"}
                  {step==="shipped" && "Shipped"}
                  {step==="delivered" && "Delivered"}
                </p>

                {i<steps.length-1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-1 
                    ${
                      currentStep===-1
                        ? "bg-red-400"
                        : i<currentStep
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}

              </div>

            ))}

          </div>

          {/* PRODUCTS */}
          <div className="border-t pt-4 space-y-4">

            {order.items?.map((item:any)=>(

              <div key={item.id} className="flex gap-4 items-center">

                <img
                  src={item.product?.image_url || "/placeholder.png"}
                  className="w-20 h-20 rounded-lg object-cover border"
                />

                <div className="flex-1">
                  <p className="font-semibold">
                    {item.product?.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="font-semibold">
                  ₹{Number(item.price * item.quantity).toLocaleString()}
                </div>

              </div>

            ))}

          </div>

          {/* RETURN BUTTON */}
          {canReturn(order) && (
            <div className="mt-6 text-right">

              <button
                disabled={returning===order.id}
                onClick={()=>requestReturn(order.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
              >
                {returning===order.id?"Processing...":"Return / Refund"}
              </button>

            </div>
          )}

          {/* REFUND */}
          {order.payment_status==="refunded" && (
            <p className="mt-6 text-red-600 font-semibold text-right">
              Amount refunded successfully
            </p>
          )}

          {/* CANCELLED */}
          {order.status==="cancelled" && (
            <p className="mt-6 text-gray-600 font-semibold text-right">
              Order cancelled
            </p>
          )}

        </div>
      )})}

    </div>
  );
}