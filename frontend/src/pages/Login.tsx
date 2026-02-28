import { useState } from "react";
import { login, register } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"customer" | "admin">("customer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    admin_secret: ""
  });

  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setError("");

      if (mode === "login") {
  const data = await login(form.email, form.password);

  // save login
  loginUser(data.access_token, data.user);

  // 🔥 FORCE NOTIFICATION SOCKET RECONNECT
  window.dispatchEvent(new Event("storage"));

  // redirect
  if (data.user.role === "admin")
    navigate("/admin");
  else
    navigate("/");
}

      // SIGNUP
      else {

        if (!form.name || !form.email || !form.password || !form.phone) {
          setError("Please fill all required fields");
          return;
        }

        if (role === "admin" && form.admin_secret !== "NEXCHAKRA-OWNER-KEY") {
          setError("Invalid admin secret key");
          return;
        }

        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: role,
          admin_secret: role === "admin" ? form.admin_secret : undefined
        });

        alert("Account created successfully! Please login.");
        setMode("login");
      }

    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-2xl p-8 text-white">

        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-2 tracking-widest">
          NEXCHAKRA
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Luxury Jewelry Collection
        </p>

        {/* SWITCH LOGIN / SIGNUP */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 pb-2 ${mode === "login" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`flex-1 pb-2 ${mode === "signup" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400"}`}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        {/* ROLE SELECTOR */}
        {mode === "signup" && (
          <div className="flex bg-black/40 rounded-xl mb-4 overflow-hidden">
            <button
              onClick={() => setRole("customer")}
              className={`flex-1 py-2 ${role === "customer" ? "bg-yellow-500 text-black" : "hover:bg-yellow-500/20"}`}
            >
              Customer
            </button>

            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 ${role === "admin" ? "bg-red-500 text-white" : "hover:bg-red-500/20"}`}
            >
              Admin
            </button>
          </div>
        )}

        {/* NAME */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-700"
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-700"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        {/* PHONE */}
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Phone"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-700"
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        )}

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-gray-700"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {/* ADMIN SECRET */}
        {mode === "signup" && role === "admin" && (
          <input
            type="password"
            placeholder="Admin Secret Key"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-red-600"
            onChange={e => setForm({ ...form, admin_secret: e.target.value })}
          />
        )}

        <button
          onClick={submit}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-xl"
        >
          {mode === "login" ? "Login" : "Create Account"}
        </button>

      </div>
    </div>
  );
}