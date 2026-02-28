import { request } from "./client";

export const getAddresses = () => request("/addresses");

export const addAddress = (data:any)=>
  request("/addresses",{
    method:"POST",
    body:JSON.stringify(data)
  });

export const deleteAddress = (id:number)=>
  request(`/addresses/${id}`,{method:"DELETE"});