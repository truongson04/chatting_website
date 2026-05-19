import { create } from "zustand";
import clientApi from "../lib/axios";
import type { User } from "../components/SignUpPage";
import { toast } from "react-hot-toast";
import axios from "axios";
import type { UserLogin } from "../components/LoginPage";
interface AuthState {
  authUser: any;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  login: (formData: UserLogin) => void;
  checkAuth: () => void;
  signUp: (formData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  login: async (formData: UserLogin) => {
    set({ isLoggingIn: true });
    try {
      const res = await clientApi.post("/auth/login", formData);
      set({ authUser: res.data });
      toast.success("Login successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  checkAuth: async () => {
    try {
      const res = await clientApi.get("/user/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (formData: User) => {
    set({ isSigningUp: true });
    try {
      const res = await clientApi.post("/auth/signUp", formData);
      toast.success("Sign up successfully");
      set({ authUser: res.data });
    } catch (error) {
      console.log(error);
      // kiểm tra lỗi bằng axios
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout: async () => {
    try {
      const res = await clientApi.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
}));
