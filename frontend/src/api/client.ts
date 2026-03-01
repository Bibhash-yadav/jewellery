const BASE_URL = "https://nexchakra-treasure-showcase-platform-1.onrender.com";

export const request = async (url: string, options: any = {}) => {

  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  // Headers
  const headers: any = {
    ...(options.headers || {})
  };

  // Only set JSON header if NOT formdata
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Attach auth token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Stringify only normal objects
  let body = options.body;
  if (body && typeof body === "object" && !isFormData) {
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    body,
    credentials: "include", // important for cookies
  });

  // Safe JSON read
  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.detail || `Error ${res.status}`);
  }

  return data;
};