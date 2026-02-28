import { request } from "./client";

export const getProfile = () => request("/me");

export const updateProfile = (data:any) =>
  request("/me", { method:"PUT", body:JSON.stringify(data) });

export const changePassword = (data:any) =>
  request("/me/password", { method:"PUT", body:JSON.stringify(data) });