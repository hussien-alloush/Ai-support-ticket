import { api } from "./client";
import type { AuthResponse, UserRole } from "../types";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
};
