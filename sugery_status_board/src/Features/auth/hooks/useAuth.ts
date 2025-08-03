 "use client"
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const { user, role } = useAuthStore();

  const fullName = user ? `${user.name.firstname} ${user.name.lastname}` : "Guest";

  return {
    user,
    role,
    fullName,
    isLoggedIn: !!user,
  };
};
