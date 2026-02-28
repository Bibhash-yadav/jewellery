import { useEffect, useState } from "react";
import { getAddresses, addAddress } from "../api/address";
import { createOrder } from "../api/order";
import { request } from "../api/client";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutPage() {

  const location = useLocation();
  const buyNowProduct = location.state?.product || null;

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [cart, setCart] = useState<any>(null);
  const [loading,setLoading]=useState(true);
  const [placing,setPlacing]=useState(false);

  const [payment,setPayment]=useState("COD");

  const [form, setForm] = useState({
    full_address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: true
  });

  const navigate = useNavigate();

  useEffect(()=>{
    loadAll();
  },[]);

  async function loadAll(){
    try{
      const addr = await getAddresses();
      setAddresses(addr || []);

      if(addr?.length){
        setSelected(addr[0].id);
      }

      if(!buyNowProduct){
        const cartData = await request("/cart");
        setCart(cartData);
      }

    }finally{
      setLoading(false);
    }
  }

  async function saveAddress(){
    if (!form.full_address || !form.city || !form.pincode)
      return alert("Fill all fields");

    await addAddress(form);

    setShowForm(false);
    setForm({
      full_address:"",
      city:"",
      state:"",
      pincode:"",
      country:"India",
      is_default:true
    });

    await loadAll();
  }

  async function placeOrder(){

    if(!selected){
      alert("Please select address");
      return;
    }

    if(!buyNowProduct && !cart?.items?.length){
      alert("Cart empty");
      return;
    }

    setPlacing(true);

    try{

      const payload:any={
        address_id:selected,
        payment_method:payment
      };

      if(buyNowProduct){
        payload.product_id=buyNowProduct.id;
        payload.quantity=1;
      }

      await createOrder(payload);

      alert("Order placed successfully!\nThanks for ordering ✨🎉");
      navigate("/orders");

    }catch(e){
      alert("Order failed — try login again or check stock");
    }

    setPlacing(false);
  }

  const items = buyNowProduct
    ? [{...buyNowProduct,quantity:1}]
    : cart?.items?.map((i:any)=>({
        ...i.product,
        quantity:i.quantity
      })) || [];

  const total = items.reduce(
    (sum:number,item:any)=> sum + Number(item.price)*item.quantity,
    0
  );

  if(loading)
    return (
      <div className="text-white bg-black min-h-screen pt-20 flex items-center justify-center">
        Loading checkout...
      </div>
    );

  return (
    <div className="bg-black text-white min-h-screen pt-20 px-4 md:px-6">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-8">

          <h1 className="text-3xl font-semibold text-[#d4af37]">
            Secure Checkout
          </h1>

          {/* ADDRESS */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl">Shipping Address</h2>
              <button
                onClick={()=>setShowForm(!showForm)}
                className="border px-3 py-1 rounded-lg"
              >
                + Add New
              </button>
            </div>

            {showForm && (
              <div className="space-y-3 mb-5">
                <input placeholder="Full Address" className="w-full bg-[#222] p-3 rounded"
                  value={form.full_address}
                  onChange={e=>setForm({...form,full_address:e.target.value})}/>
                <input placeholder="City" className="w-full bg-[#222] p-3 rounded"
                  value={form.city}
                  onChange={e=>setForm({...form,city:e.target.value})}/>
                <input placeholder="State" className="w-full bg-[#222] p-3 rounded"
                  value={form.state}
                  onChange={e=>setForm({...form,state:e.target.value})}/>
                <input placeholder="Pincode" className="w-full bg-[#222] p-3 rounded"
                  value={form.pincode}
                  onChange={e=>setForm({...form,pincode:e.target.value})}/>
                <button onClick={saveAddress}
                  className="bg-[#d4af37] text-black px-4 py-2 rounded">
                  Save Address
                </button>
              </div>
            )}

            {addresses.map(a=>(
              <div key={a.id}
                onClick={()=>setSelected(a.id)}
                className={`p-4 mb-2 border rounded cursor-pointer transition ${
                  selected===a.id?"border-yellow-400":"border-gray-600"
                }`}>
                {a.full_address} — {a.city}
              </div>
            ))}

          </div>

          {/* PAYMENT */}
          <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
            <h2 className="text-xl mb-4">Payment Method</h2>

            <div
              onClick={()=>setPayment("COD")}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                payment==="COD"
                  ?"border-yellow-400 bg-[#1a1a1a]"
                  :"border-gray-600"
              }`}
            >
              <div className="font-semibold">Cash on Delivery</div>
              <div className="text-sm text-gray-400">
                Pay when your order is delivered
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-[#111] p-6 rounded-2xl border border-[#222] h-fit">

          <h2 className="text-xl mb-6">Order Summary</h2>

          {items.map((item:any)=>(
            <div key={item.id} className="flex justify-between mb-3">
              <span>{item.title} x{item.quantity}</span>
              <span>₹{Number(item.price)*item.quantity}</span>
            </div>
          ))}

          <div className="border-t border-gray-600 mt-4 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-yellow-400">₹{total}</span>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Payment Method: <span className="text-white font-medium">{payment}</span>
          </div>

          <button
            disabled={placing}
            onClick={placeOrder}
            className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
          >
            {placing?"Placing Order...":"Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
}