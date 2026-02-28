import { useEffect, useState } from "react";
import { request } from "../api/client";

export default function AdminCarts(){

  const [carts,setCarts]=useState<any[]>([]);

  useEffect(()=>{
    load();
    const i=setInterval(load,4000);
    return ()=>clearInterval(i);
  },[]);

  async function load(){
    setCarts(await request("/admin/carts"));
  }

  return(
    <div>

      <h1 className="text-3xl font-bold mb-8">Live Shopping Carts</h1>

      {carts.map(cart=>(
        <div key={cart.id} className="bg-white p-6 rounded-xl shadow mb-6">

          <div className="font-bold mb-3">
            {cart.user?.name} ({cart.user?.email})
          </div>

          {cart.items.map((item:any)=>(
            <div key={item.id} className="flex justify-between border-t py-2">
              <span>{item.product.title}</span>
              <span>Qty: {item.quantity}</span>
            </div>
          ))}

        </div>
      ))}

    </div>
  );
}