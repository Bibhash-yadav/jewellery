import { useState, useEffect } from "react";
import { request } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {

  const navigate = useNavigate();

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [categories,setCategories]=useState<any[]>([]);

  const [form,setForm]=useState({
    title:"",
    description:"",
    price:0,
    category_id:0,
    stock:0,
    material:"",
    weight:0,
    image_url:"",
    sku:"",
    is_limited:false,
    is_active:true,
    slug:""
  });

  // ---------------- LOAD CATEGORIES ----------------
  useEffect(()=>{
    async function loadCategories(){
      try{
        const data = await request("/categories");
        setCategories(data);
      }catch{
        setError("Failed to load categories");
      }
    }
    loadCategories();
  },[]);

  // ---------------- SUBMIT PRODUCT ----------------
  const submit=async()=>{
    try{
      setLoading(true);
      setError("");

      // Validation
      if(!form.title || !form.price || !form.category_id){
        setError("Title, Price and Category are required");
        return;
      }

      // Auto slug generate
      const slug=form.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g,"")
        .replace(/\s+/g,"-");

      await request("/products",{
        method:"POST",
        body:JSON.stringify({...form,slug})
      });

      window.dispatchEvent(new Event("inventoryUpdated"));

      alert("Product created successfully!");
      navigate("/admin/products",{replace:true});

    }catch(e:any){
      console.error(e);
      setError(e?.message || "Failed to create product");
    }finally{
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-2xl">

      <h1 className="text-3xl font-bold mb-8">
        Add New Product
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* TITLE */}
        <input
          placeholder="Product Title"
          className="w-full border p-3 rounded-lg"
          onChange={e=>setForm({...form,title:e.target.value})}
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
          onChange={e=>setForm({...form,description:e.target.value})}
        />

        {/* CATEGORY SELECT */}
        <select
          className="w-full border p-3 rounded-lg"
          value={form.category_id}
          onChange={e=>setForm({...form,category_id:Number(e.target.value)})}
        >
          <option value={0}>Select Jewelry Category</option>

          {categories.map((c:any)=>(
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* PRICE */}
        <input
          placeholder="Price"
          type="number"
          className="w-full border p-3 rounded-lg"
          onChange={e=>setForm({...form,price:Number(e.target.value)})}
        />

        {/* STOCK */}
        <input
          placeholder="Stock Quantity"
          type="number"
          className="w-full border p-3 rounded-lg"
          onChange={e=>setForm({...form,stock:Number(e.target.value)})}
        />

        {/* MATERIAL */}
        <input
          placeholder="Material (Gold / Silver / Diamond)"
          className="w-full border p-3 rounded-lg"
          onChange={e=>setForm({...form,material:e.target.value})}
        />

        {/* IMAGE URL */}
        <input
          placeholder="Paste Cloudinary Image URL"
          className="w-full border p-3 rounded-lg"
          onChange={e=>setForm({...form,image_url:e.target.value})}
        />

        {/* IMAGE PREVIEW */}
        {form.image_url && (
          <img
            src={form.image_url}
            onError={(e:any)=>e.target.src="https://placehold.co/400x250?text=Invalid+Image"}
            className="h-56 object-cover rounded-xl border w-full"
          />
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          onClick={submit}
          className="bg-yellow-500 px-6 py-3 rounded-xl font-semibold text-black hover:bg-yellow-400 transition w-full disabled:opacity-50"
        >
          {loading ? "Creating Product..." : "Create Product"}
        </button>

      </div>
    </div>
  );
}