import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  role?: string;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { token, user, loading } = useAuth();

  // wait for auth to load
  if (loading) return null;

  if (!token || !user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}