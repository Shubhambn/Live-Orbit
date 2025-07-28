import { useAuthStore } from "../store/useAuthStore";

export function handleLogin(email: string, password: string): boolean {
  const login = useAuthStore.getState().login;
  return login(email, password);
}
