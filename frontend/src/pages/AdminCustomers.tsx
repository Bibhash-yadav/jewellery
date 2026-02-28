import { useEffect, useState } from "react";
import { request } from "../api/client";

export default function AdminCustomers(){

  const [users,setUsers]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    loadUsers();
  },[]);

  async function loadUsers(){
    try{
      const data = await request("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    }catch(err){
      console.error("Users fetch failed",err);
      setUsers([]);
    }finally{
      setLoading(false);
    }
  }

  if(loading){
    return <div className="text-gray-500">Loading customers...</div>;
  }

  return(
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">Admin & Customers</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-left">
              <th className="p-4">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  No customers found
                </td>
              </tr>
            ) : (
              users.map(u=>(
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{u.name || "-"}</td>
                  <td>{u.email || "-"}</td>
                  <td>{u.phone || "-"}</td>
                  <td>
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}