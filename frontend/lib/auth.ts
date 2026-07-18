import { jwtDecode } from "jwt-decode";

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getCurrentUser() {
  const token = getToken();

  if (!token) return null;

  try {
    return jwtDecode<{
      userId: number;
      email: string;
      role: "MANAGER" | "MEMBER";
    }>(token);
  } catch {
    return null;
  }
}
