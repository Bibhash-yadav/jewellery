import { useEffect, useState } from "react";
import { getWishlist, toggleWishlist } from "../api/wishlist";

export default function WishlistPage(){

  const [items,setItems]=useState<any[]>([]);

  useEffect(()=>{
    getWishlist().then(setItems);
  },[]);

  const remove=async(id:number)=>{
    await toggleWishlist(id);
    setItems(items.filter(i=>i.id!==id));
  };

  return(
    <div className="pt-28 max-w-6xl mx-auto px-6">

      <h1 className="text-3xl font-bold mb-8">Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {items.map(p=>(
          <div key={p.id} className="bg-white p-4 rounded-xl shadow">

            <img src={p.image_url} className="h-48 w-full object-cover rounded"/>

            <h2 className="mt-3 font-semibold">{p.title}</h2>

            <button
              onClick={()=>remove(p.id)}
              className="mt-3 text-red-500"
            >
              Remove
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}