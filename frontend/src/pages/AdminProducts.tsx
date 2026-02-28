import { useEffect, useState } from "react";
import { getProducts, updateProduct, deleteProductApi } from "../api/products";

export default function AdminProducts(){

  const [products,setProducts]=useState<any[]>([]);
  const [editing,setEditing]=useState<any|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  // LOAD PRODUCTS
 const load=async()=>{
  try{
    setLoading(true);
    setError("");
    const data=await getProducts();

    // ⭐ ALWAYS PUT LATEST CHANGED FIRST
    const sorted=[...data].sort((a:any,b:any)=>{
      const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
      const dateB = new Date(b.updated_at || b.created_at || 0).getTime();

      if(dateA === dateB) return b.id - a.id; // fallback
      return dateB - dateA;
    });

    setProducts(sorted);

  }catch(e){
    console.error(e);
    setError("Failed to load products (login again)");
  }finally{
    setLoading(false);
  }
};

  useEffect(()=>{load();},[]);

  // DELETE
  const remove=async(id:number)=>{
    if(!confirm("Delete product?"))return;

    try{
      await deleteProductApi(id);
      setProducts(prev=>prev.filter(p=>p.id!==id));
      window.dispatchEvent(new Event("inventoryUpdated"));
    }catch{
      alert("Delete failed");
    }
  };

  // SAVE EDIT
  const save=async()=>{
  if(!editing)return;

  try{
    await updateProduct(editing.id,editing);

    // move edited product to top instantly
    setProducts(prev=>{
      const others=prev.filter(p=>p.id!==editing.id);
      return [{...editing},...others];
    });

    setEditing(null);
    window.dispatchEvent(new Event("inventoryUpdated"));

  }catch{
    alert("Update failed");
  }
};

  // UI STATES
  if(loading) return <div className="p-10">Loading products...</div>;
  if(error) return <div className="p-10 text-red-500">{error}</div>;

  return(
    <div>

      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      {products.length===0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          No products found
        </div>
      )}

      {products.length>0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p,index)=>(
                <tr key={p.id} className="border-t hover:bg-gray-50">

                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={p.image_url}
                      onError={(e:any)=>e.target.src="https://placehold.co/100x100?text=No+Image"}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                    <div>
                      <div className="font-medium">{p.title}</div>
                     <div className="text-xs text-gray-500"># {index + 1}</div>
                    </div>
                  </td>

                  <td className="p-4 text-yellow-600 font-semibold">
                    ₹ {p.price}
                  </td>

                  <td className={`p-4 ${p.stock<=5?"text-red-500 font-semibold":""}`}>
                    {p.stock}
                  </td>

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={()=>setEditing({...p})}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={()=>remove(p.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
     {editing && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">

    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl font-bold text-center">Edit Product</h2>

      <input
        className="w-full border p-3 rounded-lg"
        value={editing.title}
        onChange={e=>setEditing({...editing,title:e.target.value})}
        placeholder="Title"
      />

      <input
        type="number"
        className="w-full border p-3 rounded-lg"
        value={editing.price}
        onChange={e=>setEditing({...editing,price:Number(e.target.value)})}
        placeholder="Price"
      />

      <input
        type="number"
        className="w-full border p-3 rounded-lg"
        value={editing.stock}
        onChange={e=>setEditing({...editing,stock:Number(e.target.value)})}
        placeholder="Stock"
      />

      <input
        className="w-full border p-3 rounded-lg"
        value={editing.image_url}
        onChange={e=>setEditing({...editing,image_url:e.target.value})}
        placeholder="Image URL"
      />

      {editing.image_url && (
        <img
          src={editing.image_url}
          onError={(e:any)=>e.target.src="https://placehold.co/400x250"}
          className="rounded-lg border w-full max-h-60 object-cover"
        />
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={save}
          className="flex-1 bg-yellow-500 py-3 rounded-lg font-semibold hover:bg-yellow-400"
        >
          Save Changes
        </button>

        <button
          onClick={()=>setEditing(null)}
          className="flex-1 bg-gray-200 py-3 rounded-lg"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}