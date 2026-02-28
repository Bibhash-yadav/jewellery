import { useEffect, useState } from "react";
import { request } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function CartPage(){

  const [cart,setCart]=useState<any>(null);
  const [addresses,setAddresses]=useState<any[]>([]);
  const [selected,setSelected]=useState<number | null>(null);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();

  const load=async()=>{
    try{
      const cartData=await request("/cart");
      const addr=await request("/addresses");

      setCart(cartData);
      setAddresses(addr);

      if(addr.length>0 && !selected)
        setSelected(addr[0].id);

    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{load();},[]);

  // CHANGE QUANTITY
  const changeQty=async(id:number,qty:number)=>{
    if(qty<0) return;

    await request(`/cart/items/${id}?quantity=${qty}`,{method:"PATCH"});
    load();
  };

  // REMOVE ITEM
  const removeItem=async(id:number)=>{
    await request(`/cart/items/${id}?quantity=0`,{method:"PATCH"});
    load();
  };

  // PLACE ORDER (NEW API)
  const placeOrder=async()=>{
    if(!selected) return alert("Please select address");

    if(!cart?.items?.length) return alert("Cart is empty");

    await request("/orders",{
      method:"POST",
      body:JSON.stringify({
        address_id:selected
      })
    });

    alert("Order placed successfully!");
    navigate("/orders");
  };

  if(loading)
    return <div className="text-white p-10 bg-black min-h-screen">Loading...</div>;

  if(!cart?.items?.length)
    return <div className="text-white p-10 bg-black min-h-screen text-center">Cart empty</div>;

  const total = cart.items.reduce(
    (sum:any,item:any)=>sum + item.product.price*item.quantity,
    0
  );

  return(
    <div className="bg-black min-h-screen text-white p-6">

      <div className="max-w-6xl mx-auto space-y-8">

        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        {/* CART ITEMS */}
        {cart.items.map((item:any)=>(

          <div key={item.id} className="flex flex-col md:flex-row gap-6 bg-gray-900 p-4 rounded-2xl">

            <img src={item.product.image_url} className="w-32 h-32 rounded-xl object-cover"/>

            <div className="flex-1 space-y-2">
              <h2 className="font-semibold">{item.product.title}</h2>
              <p className="text-yellow-400">₹{item.product.price}</p>

              <div className="flex gap-3 items-center">

                <button
                  onClick={()=>changeQty(item.id,item.quantity-1)}
                  className="bg-gray-700 px-3 rounded hover:bg-gray-600"
                >−</button>

                <span className="px-3">{item.quantity}</span>

                <button
                  onClick={()=>changeQty(item.id,item.quantity+1)}
                  className="bg-gray-700 px-3 rounded hover:bg-gray-600"
                >+</button>

                <button
                  onClick={()=>removeItem(item.id)}
                  className="ml-4 text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>

              </div>
            </div>

            <div className="font-bold text-xl text-yellow-400">
              ₹{(item.product.price*item.quantity).toFixed(2)}
            </div>

          </div>
        ))}

        {/* ADDRESS + TOTAL */}
        <div className="bg-gray-900 p-6 rounded-2xl space-y-4">

          <h2 className="text-xl font-semibold">Delivery Address</h2>

          <select
            value={selected || ""}
            onChange={e=>setSelected(Number(e.target.value))}
            className="w-full p-3 bg-gray-800 rounded"
          >
            <option value="">Select Address</option>
            {addresses.map(a=>(
              <option key={a.id} value={a.id}>
                {a.full_address}, {a.city}
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">

            <div className="text-2xl font-bold">
              Total: <span className="text-yellow-400">₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={placeOrder}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              Place Order
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}