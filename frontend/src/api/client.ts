const BASE_URL = "https://nexchakra-treasure-showcase-platform-1.onrender.com/";

export const request = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  // Merge headers correctly
  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Attach token if exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Auto stringify body if object
  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers,
    body,
    credentials: "include",
  });

  // Try read json safely
  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.detail || "Something went wrong");
  }

  return data;
};