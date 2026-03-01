import { useEffect, useState } from "react";
import { request } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function Products(){

  const [products,setProducts]=useState<any[]>([]);
  const [categories,setCategories]=useState<any[]>([]);
  const [selectedCategory,setSelectedCategory]=useState<number | null>(null);
  const [loading,setLoading]=useState(true);
  const navigate=useNavigate();

  useEffect(()=>{
    const load=async()=>{
      try{
        const data=await request("/products");
        const cats=await request("/categories");
        setProducts(data);
        setCategories(cats);
      }finally{
        setLoading(false);
      }
    };
    load();
  },[]);

  // ADD TO CART (unchanged)
  const addToCart=async(id:number)=>{
    await request("/cart/items",{
      method:"POST",
      body:JSON.stringify({product_id:id,quantity:1})
    });
    window.dispatchEvent(new Event("inventoryUpdated"));
    alert("Added to cart");
  };

  // 🔥 NEW BUY NOW (NO CART)
  const buyNow=(product:any)=>{
    navigate("/checkout",{
      state:{
        product:product
      }
    });
  };

  const filteredProducts = selectedCategory
    ? products.filter(p=>p.category_id===selectedCategory)
    : products;

  if(loading){
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        Loading collection...
      </div>
    );
  }

  return(
    <div className="bg-black min-h-screen text-white px-6 py-20">

      <h1 className="text-4xl font-semibold text-center text-[#d4af37] mb-10 tracking-wide">
        Our Collection
      </h1>

      {/* CATEGORY FILTER */}
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        <button
          onClick={()=>setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory===null
            ? "bg-[#d4af37] text-black border-[#d4af37]"
            : "border-[#333] hover:border-[#d4af37]"
          }`}
        >
          All
        </button>

        {categories.map((c:any)=>(
          <button
            key={c.id}
            onClick={()=>setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory===c.id
              ? "bg-[#d4af37] text-black border-[#d4af37]"
              : "border-[#333] hover:border-[#d4af37]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filteredProducts.length===0 && (
        <div className="text-center text-gray-400">
          No products found.
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">

        {filteredProducts.map(p=>(

          <div
            key={p.id}
            onClick={()=>navigate(`/product/${p.id}`)}
            className="group bg-[#111] rounded-3xl overflow-hidden border border-[#222] hover:border-[#d4af37]/40 transition-all duration-300 cursor-pointer"
          >

            <div className="relative">
              <img
                src={p.image_url}
                alt={p.title}
                className="h-72 w-full object-cover group-hover:scale-105 transition duration-500"
              />

              {p.featured && (
                <div className="absolute top-3 left-3 bg-[#d4af37] text-black text-xs px-3 py-1 rounded-full font-semibold">
                  Featured
                </div>
              )}

              {p.stock<=5 && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                  Low Stock
                </div>
              )}
            </div>

            <div className="p-6">

              <h2 className="text-lg font-medium tracking-wide">
                {p.title}
              </h2>

              <p className="text-[#d4af37] text-2xl font-semibold mt-2">
                ₹{p.price}
              </p>

              <div className="flex gap-3 mt-6">

                {/* ADD TO CART */}
                <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    addToCart(p.id);
                  }}
                  className="flex-1 border border-[#444] py-2 rounded-xl hover:border-[#d4af37] hover:text-[#d4af37] transition"
                >
                  Add to Cart
                </button>

                {/* BUY NOW */}
                <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    buyNow(p);
                  }}
                  className="flex-1 bg-[#d4af37] text-black py-2 rounded-xl font-semibold hover:bg-yellow-400 transition"
                >
                  Buy Now
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}