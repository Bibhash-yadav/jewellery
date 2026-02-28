import { request } from "./client";

export const toggleWishlist = (product_id: number) =>
  request(`/wishlist/${product_id}`, { method: "POST" });

export const getWishlist = () => request("/wishlist");