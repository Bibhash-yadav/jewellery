import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  Users,
  ShoppingCart,
  LogOut,
  Bell
} from "lucide-react";
import useNotifications from "../hooks/useNotifications";

export default function AdminLayout() {

  const navigate = useNavigate();
  const [notifOpen,setNotifOpen] = useState(false);

  // SAFE USER PARSE (prevents crash)
  let user:any = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {}

  // SAFE NOTIFICATIONS (prevents blank page)
  let notifications:any[] = [];
  let unread = 0;
  let markRead = () => {};

  try {
    const notif = useNotifications();
    notifications = notif.notifications || [];
    unread = notif.unread || 0;
    markRead = notif.markRead || (()=>{});
  } catch (e) {
    console.log("Notifications disabled");
  }

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between fixed h-full p-6">

        <div>
          <h1 className="text-2xl font-bold text-yellow-400 mb-8">
            Admin Panel
          </h1>

          <nav className="space-y-5 text-sm">

            <Link to="/admin" className="flex items-center gap-3 hover:text-yellow-400">
              <LayoutDashboard size={18}/> Dashboard
            </Link>

            <Link to="/admin/products" className="flex items-center gap-3 hover:text-yellow-400">
              <Package size={18}/> Manage Products
            </Link>

            <Link to="/admin/create-product" className="flex items-center gap-3 hover:text-yellow-400">
              <PlusSquare size={18}/> Add Product
            </Link>

            <Link to="/admin/customers" className="flex items-center gap-3 hover:text-yellow-400">
              <Users size={18}/> Customers
            </Link>

            <Link to="/admin/orders" className="flex items-center gap-3 hover:text-yellow-400">
              <Package size={18}/> Orders
            </Link>

            <Link to="/admin/carts" className="flex items-center gap-3 hover:text-yellow-400">
              <ShoppingCart size={18}/> Live Carts
            </Link>

          </nav>
        </div>

        {/* Bottom */}
        <div className="space-y-4">

          {user && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-gray-400 text-xs">Administrator</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-xl w-full hover:bg-yellow-400 transition"
          >
            <LogOut size={16}/> Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-64 flex flex-col h-screen">

        {/* TOPBAR */}
        <div className="bg-white shadow-md px-10 py-4 flex justify-between items-center">

          <h2 className="text-xl font-semibold">
            Admin Dashboard
          </h2>

          {/* NOTIFICATIONS */}
          <div className="relative">
            <button
              onClick={()=>{
                setNotifOpen(!notifOpen);
                markRead();
              }}
              className="relative text-gray-700 hover:text-black"
            >
              <Bell size={22}/>
              {unread>0 &&(
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full text-white">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white border rounded-xl shadow-lg">

                <div className="p-3 font-semibold border-b">
                  Notifications
                </div>

                {notifications.length===0 &&(
                  <p className="p-4 text-gray-400 text-sm">
                    No notifications
                  </p>
                )}

                {notifications.map((n,i)=>(
                  <div key={i} className="p-4 border-b text-sm hover:bg-gray-100">
                    <p className="font-semibold text-yellow-600">
                      Order #{n?.order_id}
                    </p>
                    <p className="text-gray-600">
                      {n?.customer}
                    </p>
                    <p className="font-semibold text-green-600">
                      ₹{n?.amount}
                    </p>
                  </div>
                ))}

              </div>
            )}
          </div>

        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-10 bg-gray-100">
          <Outlet />
        </main>

      </div>

    </div>
  );
}