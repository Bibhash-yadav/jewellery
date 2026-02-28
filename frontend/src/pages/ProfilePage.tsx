import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../api/profile";

export default function ProfilePage(){

  const [profile,setProfile]=useState<any>(null);
  const [pass,setPass]=useState({old_password:"",new_password:""});
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    getProfile().then(setProfile);
  },[]);

  if(!profile) return <div className="text-white p-10">Loading...</div>;

  const save=async()=>{
    await updateProfile({name:profile.name,phone:profile.phone});
    localStorage.setItem("user",JSON.stringify(profile));
    setMsg("Profile updated!");
  };

  const updatePass=async()=>{
    await changePassword(pass);
    setMsg("Password changed!");
    setPass({old_password:"",new_password:""});
  };

  return(
    <div className="bg-black min-h-screen text-white flex justify-center py-20 px-6">

      <div className="w-full max-w-2xl space-y-10">

        <h1 className="text-3xl font-bold text-yellow-500">My Account</h1>

        {msg && <p className="text-green-400">{msg}</p>}

        {/* PROFILE INFO */}
        <div className="bg-gray-900 p-8 rounded-2xl space-y-4">

          <input
            value={profile.name}
            onChange={e=>setProfile({...profile,name:e.target.value})}
            className="w-full p-3 bg-black rounded border border-gray-700"
            placeholder="Name"
          />

          <input
            value={profile.email}
            disabled
            className="w-full p-3 bg-black/50 rounded border border-gray-700 text-gray-400"
          />

          <input
            value={profile.phone}
            onChange={e=>setProfile({...profile,phone:e.target.value})}
            className="w-full p-3 bg-black rounded border border-gray-700"
            placeholder="Phone"
          />

          <button
            onClick={save}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400">
            Save Changes
          </button>

        </div>

        {/* PASSWORD */}
        <div className="bg-gray-900 p-8 rounded-2xl space-y-4">

          <h2 className="text-xl font-semibold">Change Password</h2>

          <input
            type="password"
            placeholder="Old Password"
            value={pass.old_password}
            onChange={e=>setPass({...pass,old_password:e.target.value})}
            className="w-full p-3 bg-black rounded border border-gray-700"
          />

          <input
            type="password"
            placeholder="New Password"
            value={pass.new_password}
            onChange={e=>setPass({...pass,new_password:e.target.value})}
            className="w-full p-3 bg-black rounded border border-gray-700"
          />

          <button
            onClick={updatePass}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400">
            Update Password
          </button>

        </div>

      </div>
    </div>
  );
}