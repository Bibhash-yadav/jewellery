import { request } from "./client";

export const createOrder = (data:any)=>
  request("/orders",{
    method:"POST",
    body:JSON.stringify(data)
  });