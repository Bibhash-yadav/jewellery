import { request } from "./client";

// GET PRODUCTS
export const getProducts = async (category_id?: number) => {
  if (category_id)
    return request(`/products?category_id=${category_id}`);
  return request("/products");
};

// CREATE PRODUCT
export const createProduct = async (data:any) => {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// UPDATE PRODUCT
export const updateProduct = async (id:number, data:any) => {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

// DELETE PRODUCT
export const deleteProductApi = async (id:number) => {
  return request(`/products/${id}`, {
    method: "DELETE"
  });
};