import { create } from "zustand";
interface UseThemeStore {
  theme: string;
  setTheme: (newTheme: string) => void;
}
export const useThemeStore = create<UseThemeStore>()((set) => ({
  theme: localStorage.getItem("main-theme") || "light",
  setTheme: (newTheme: string) => {
    localStorage.setItem("main-theme", newTheme);
    set({ theme: newTheme });
  },
}));
