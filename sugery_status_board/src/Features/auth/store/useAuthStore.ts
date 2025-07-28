// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dummyUsers } from "../data/users";

interface AuthStore {
  user: User | null; // Ideally, define a proper type
  role: "visitor" | "admin" | "surgeon" | "nurse" | string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      role: "visitor",
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
      name: "auth-store", // name of item in localStorage
      partialize: (state) => ({ user: state.user, role: state.role }), // only persist these
    }
  )
);
