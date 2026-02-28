import { request } from "./client";

export const getCart = () => request("/cart");

export const addToCart = (product_id: number, quantity: number = 1) =>
  request("/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id, quantity }),
  });

export const removeFromCart = (id: number) =>
  request(`/cart/items/${id}`, { method: "DELETE" });