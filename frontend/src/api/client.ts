const BASE_URL = "http://127.0.0.1:8000";

export const request = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    credentials: "include",
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Something went wrong");
  }

  if (res.status === 204) return null;

  return res.json();
};