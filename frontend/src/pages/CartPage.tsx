import { useEffect, useState } from "react";
import { request } from "../api/client";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CartPage(){

  const [cart,setCart]=useState<any>(null);
  const [address,setAddress]=useState<number|null>(null);
  const [addresses,setAddresses]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<number[]>([]);

  const navigate=useNavigate();
  const [params]=useSearchParams();

  const buyProduct=params.get("product");
  const buyQty=Number(params.get("qty")||1);

  const load=async()=>{
    const c=await request("/cart");
    const a=await request("/addresses");

    setCart(c);
    setAddresses(a);

    if(a?.length) setAddress(a[0].id);

    if(c?.items){
      setSelected(c.items.map((i:any)=>i.id));
    }

    setLoading(false);
  };

  useEffect(()=>{
    if(buyProduct){
      request(`/products/${buyProduct}`).then(p=>{
        setCart({
          items:[{
            id:999,
            quantity:buyQty,
            product:p
          }]
        });
        setSelected([999]);
        setLoading(false);
      });
    }else{
      load();
    }
  },[]);

  // toggle select
  const toggle=(id:number)=>{
    setSelected(prev=>
      prev.includes(id)
        ? prev.filter(i=>i!==id)
        : [...prev,id]
    );
  };

  // update quantity
  const changeQty=async(id:number,q:number)=>{
    if(q<1) return;
    await request(`/cart/items/${id}?quantity=${q}`,{method:"PATCH"});
    load();
  };

  const placeOrder=async()=>{
    if(!address) return alert("Select address");
    if(selected.length===0) return alert("Select at least one item");

    if(buyProduct){
      await request("/orders",{
        method:"POST",
        body:{
          address_id:address,
          product_id:Number(buyProduct),
          quantity:buyQty
        }
      });
    }else{
      await request("/orders",{
        method:"POST",
        body:{
          address_id:address,
          items:selected
        }
      });
    }

    navigate("/orders");
  };

  // LOADING STATE (fixed navbar safe)
  if(loading)
    return (
      <div className="bg-black text-white min-h-screen pt-20 flex items-center justify-center">
        Loading...
      </div>
    );

  // EMPTY STATE (fixed navbar safe)
  if(!cart?.items?.length)
    return (
      <div className="bg-black text-white min-h-screen pt-20 flex items-center justify-center">
        Cart Empty
      </div>
    );

  const total=cart.items
    .filter((i:any)=>selected.includes(i.id))
    .reduce((s:any,i:any)=>s+i.product.price*i.quantity,0);

  return(
    <div className="bg-black min-h-screen text-white pt-20 px-4 md:px-6 pb-10 max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* PRODUCTS */}
      <div className="space-y-4">
        {cart.items.map((item:any)=>(
          <div key={item.id} className="flex gap-4 bg-gray-900 p-4 rounded-xl items-center">

            {!buyProduct && (
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={()=>toggle(item.id)}
                className="w-5 h-5 accent-yellow-500"
              />
            )}

            <img
              src={item.product.image_url}
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-semibold">{item.product.title}</p>
              <p className="text-yellow-400">₹{item.product.price}</p>

              {!buyProduct && (
                <div className="flex gap-3 mt-2 items-center">
                  <button
                    onClick={()=>changeQty(item.id,item.quantity-1)}
                    className="bg-gray-700 px-3 rounded">−</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={()=>changeQty(item.id,item.quantity+1)}
                    className="bg-gray-700 px-3 rounded">+</button>
                </div>
              )}
            </div>

            <div className="text-yellow-400 font-bold">
              ₹{item.product.price*item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="mt-6 space-y-4 bg-gray-900 p-6 rounded-xl">

        <select
          value={address||""}
          onChange={e=>setAddress(Number(e.target.value))}
          className="w-full p-3 bg-gray-800 rounded">
          <option value="">Select address</option>
          {addresses.map(a=>(
            <option key={a.id} value={a.id}>
              {a.full_address}, {a.city}
            </option>
          ))}
        </select>

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-yellow-400">₹{total}</span>
        </div>

        <button
          onClick={placeOrder}
          className="w-full bg-yellow-500 text-black py-3 rounded-xl hover:bg-yellow-400 transition">
          Place Order (COD)
        </button>

      </div>

    </div>
  );
}