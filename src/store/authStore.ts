// Shared preamble:
// Build this as part of a React 18 + TypeScript + Vite project.
// Place code in the exact file path specified: src/store/authStore.ts

import { create } from "zustand";

const TOKEN_KEY = "secureshare_token";
const USER_KEY = "secureshare_user";

interface UserData {
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (token: string, username: string, email: string) => void;
  logout: () => void;
  hydrate: () => void;
  updateUsername: (username: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  username: null,
  email: null,
  isAuthenticated: false,
  isHydrated: false,

  login: (token: string, username: string, email: string) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify({ username, email }));

    set({
      token,
      username,
      email,
      isAuthenticated: true,
      isHydrated: true,
    });
  },

  logout: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    set({
      token: null,
      username: null,
      email: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },

  hydrate: () => {
    const storedToken = sessionStorage.getItem(TOKEN_KEY);
    const storedUserRaw = sessionStorage.getItem(USER_KEY);

    if (storedToken) {
      let username: string | null = null;
      let email: string | null = null;

      if (storedUserRaw) {
        try {
          const parsedUser: UserData = JSON.parse(storedUserRaw);
          username = parsedUser.username;
          email = parsedUser.email;
        } catch (error) {
          console.error("Failed to parse stored user session data", error);
        }
      }

      set({
        token: storedToken,
        username,
        email,
        isAuthenticated: true,
        isHydrated: true,
      });
    } else {
      set({
        isHydrated: true,
      });
    }
  },

  updateUsername: (newUsername: string) => {
    const storedUser = sessionStorage.getItem(USER_KEY);
    let updatedUserData: UserData;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        updatedUserData = { ...parsed, username: newUsername };
      } catch {
        updatedUserData = { username: newUsername, email: get().email || "" };
      }
    } else {
      updatedUserData = { username: newUsername, email: get().email || "" };
    }

    sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUserData));
    set({ username: newUsername });
  },
}));

export const getToken = (): string | null => {
  return useAuthStore.getState().token || sessionStorage.getItem(TOKEN_KEY);
};
