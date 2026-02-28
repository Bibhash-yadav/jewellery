import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { request } from "../api/client";
import useNotifications from "../hooks/useNotifications";
import {
  ShoppingCart,
  Package,
  Home,
  Store,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Bell
} from "lucide-react";

export default function Navbar(){

  const navigate = useNavigate();

  const [cartCount,setCartCount] = useState(0);
  const [menuOpen,setMenuOpen] = useState(false);
  const [profileOpen,setProfileOpen] = useState(false);
  const [notifOpen,setNotifOpen] = useState(false);
  const [scrolled,setScrolled] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // 🔔 notifications hook
  const {notifications,unread,markRead} = useNotifications();

  // ---------------- SCROLL EFFECT ----------------
  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>10);
    window.addEventListener("scroll",onScroll);
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  // ---------------- CART COUNT ----------------
  const loadCart = async()=>{
    if(!localStorage.getItem("token")) return;

    try{
      const data = await request("/cart");
      const totalQty = data?.items?.reduce(
        (acc:number,item:any)=>acc+item.quantity,0
      ) || 0;

      setCartCount(totalQty);
    }catch{}
  };

  useEffect(()=>{
    loadCart();
    window.addEventListener("inventoryUpdated",loadCart);
    return ()=>window.removeEventListener("inventoryUpdated",loadCart);
  },[]);

  // close dropdown if storage changes (login/logout)
  useEffect(()=>{
    const syncUser=()=>setProfileOpen(false);
    window.addEventListener("storage",syncUser);
    return ()=>window.removeEventListener("storage",syncUser);
  },[]);

  // ---------------- LOGOUT ----------------
  const logout=()=>{
    localStorage.clear();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  // ---------------- UI ----------------
  return(
    <nav className={`fixed top-0 left-0 w-full z-[9999] border-b border-yellow-600 transition-all duration-300
    ${scrolled ? "bg-black/95 shadow-2xl shadow-yellow-900/20 backdrop-blur-lg" : "bg-black"}
    text-white`}>

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-yellow-500 tracking-wide">
          NexChakra
        </Link>

        {/* ---------------- DESKTOP ---------------- */}
        <div className="hidden md:flex gap-8 items-center">

          <Link to="/" className="flex items-center gap-2 hover:text-yellow-400 transition">
            <Home size={18}/> Home
          </Link>

          <Link to="/products" className="flex items-center gap-2 hover:text-yellow-400 transition">
            <Store size={18}/> Shop
          </Link>

          <Link to="/orders" className="flex items-center gap-2 hover:text-yellow-400 transition">
            <Package size={18}/> Orders
          </Link>

          {/* CART */}
          <Link to="/cart" className="relative flex items-center gap-2 hover:text-yellow-400 transition">
            <ShoppingCart size={18}/>
            Cart
            {cartCount>0 &&(
              <span className="absolute -top-2 -right-4 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-semibold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* 🔔 NOTIFICATIONS */}
          {user && (
            <div className="relative">

              <button
                onClick={()=>{
                  setNotifOpen(!notifOpen);
                  markRead();
                }}
                className="relative hover:text-yellow-400"
              >
                <Bell size={20}/>

                {unread>0 &&(
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                    {unread}
                  </span>
                )}
              </button>

              {notifOpen &&(
                <div className="absolute right-0 mt-3 w-72 max-h-96 overflow-y-auto bg-black border border-yellow-600 rounded-xl shadow-lg">

                  <div className="p-3 font-semibold border-b border-yellow-600">
                    Notifications
                  </div>

                  {notifications.length===0 &&(
                    <p className="p-4 text-gray-400 text-sm">No notifications</p>
                  )}

                  {notifications.map((n,i)=>(
                    <div key={i} className="p-4 border-b border-gray-800 text-sm hover:bg-yellow-500/10">
                      <p className="text-yellow-400 font-medium">{n.title}</p>
                      <p className="text-gray-300">{n.message}</p>
                    </div>
                  ))}

                </div>
              )}

            </div>
          )}

          {/* PROFILE */}
          {user ? (
            <div className="relative">

              <button
                onClick={()=>setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:text-yellow-400 transition"
              >
                <div className="w-9 h-9 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <Settings size={18}/>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-black border border-yellow-600 rounded-xl shadow-lg overflow-hidden">

                  <button
                    onClick={()=>{
                      setProfileOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-yellow-500/10 flex items-center gap-2"
                  >
                    <User size={16}/> Account
                  </button>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                  >
                    <LogOut size={16}/> Logout
                  </button>

                </div>
              )}

            </div>
          ):(
            <button
              onClick={()=>navigate("/login")}
              className="bg-yellow-500 text-black px-4 py-2 rounded-xl hover:bg-yellow-400 transition"
            >
              Login
            </button>
          )}

        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-yellow-500"
          onClick={()=>setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26}/> : <Menu size={26}/>}
        </button>
      </div>

      {/* ---------------- MOBILE MENU ---------------- */}
      {menuOpen &&(
        <div className="md:hidden bg-black px-6 pb-6 space-y-4 flex flex-col border-t border-yellow-700">

          <Link to="/" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 py-2">
            <Home size={18}/> Home
          </Link>

          <Link to="/products" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 py-2">
            <Store size={18}/> Shop
          </Link>

          <Link to="/orders" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 py-2">
            <Package size={18}/> My Orders
          </Link>

          <Link to="/cart" onClick={()=>setMenuOpen(false)} className="flex items-center gap-3 py-2">
            <ShoppingCart size={18}/> Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <button
                onClick={()=>{
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="flex items-center gap-3 py-2"
              >
                <User size={18}/> Account
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-3 bg-red-600 text-white px-4 py-2 rounded-xl mt-2"
              >
                <LogOut size={18}/> Logout
              </button>
            </>
          ):(
            <button
              onClick={()=>navigate("/login")}
              className="bg-yellow-500 text-black px-4 py-2 rounded-xl mt-2"
            >
              Login
            </button>
          )}

        </div>
      )}

    </nav>
  );
}