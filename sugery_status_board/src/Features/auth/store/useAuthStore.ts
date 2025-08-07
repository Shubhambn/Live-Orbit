// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dummyUsers } from "../data/users";
import { User } from "../types/type";

interface AuthStore {
  user: User | null;
  role: "visitor" | "admin" | "surgeon" | "nurse" | string;
  hasHydrated: boolean;
  setHydrated: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      role: "visitor",
      hasHydrated: false,
      setHydrated: () => set({ hasHydrated: true }),
      login: (email, password) => {
        const found = dummyUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (found) {
          set({ user: found, role: found.role });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, role: "visitor" }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        role: state.role,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(); //  sets hasHydrated = true when storage loads
      },
    }
  )
);
