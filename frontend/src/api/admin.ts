import { request } from "./client";

export async function getAllProducts() {
  return request("/products");
}

export async function getAllCategories() {
  return request("/categories");
}