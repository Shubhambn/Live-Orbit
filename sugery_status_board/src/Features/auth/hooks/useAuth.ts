import { useAuthStore } from "../store/useAuthStore";


export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const fullName = user ? `${user.name.firstname} ${user.name.lastname}` : "Guest";

  return {
    user,
    role,
    fullName,
    isLoggedIn: !!user,
    hasHydrated,
  };
};
