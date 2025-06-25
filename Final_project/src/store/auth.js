import { isTokenExpire } from "@/api";
import { refreshTokeAPI } from "@/api/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      loading: false,

      setTokens: (tokens) => {
        try {
          const decoded = jwtDecode(tokens.token);
          const userId = decoded?.id;
          if (!userId) throw new Error("no id found in token");
          set({ ...tokens, userId });
        } catch (err) {
          console.error("❌ Failed to decode token:", err);
        }
      },

      clear: () => set({ token: null, refreshToken: null }),
      isValidTokens: async () => {
        set({ loading: true });
        const { token, refreshToken, clear } = get();
        if (isTokenExpire(token) && isTokenExpire(refreshToken)) {
          clear();
          return false;
        }
        if (!isTokenExpire(token) || !isTokenExpire(refreshToken)) {
          if (isTokenExpire(token)) {
            try {
              const res = await refreshTokeAPI({ refreshToken });
              set({ ...res.data });
            } catch {
              clear();
              return false;
            }
          }
          return true;
        }
        clear();
        set({ loading: false });
        return false;
      },
    }),
    {
      name: "auth-store",
    }
  )
);
