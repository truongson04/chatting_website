import { create } from "zustand";
import clientApi from "../lib/axios";
import type { User } from "../components/SignUpPage";
import { toast } from "react-hot-toast";
import axios from "axios";
import type { UserLogin } from "../components/LoginPage";
import type { UpdateProfile } from "../components/ProfilePage";
import type { Users } from "./useChat";
import { io, Socket } from "socket.io-client";
export interface UserCurrent {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}
interface AuthState {
  authUser: UserCurrent | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  login: (formData: UserLogin) => void;
  checkAuth: () => void;
  signUp: (formData: User) => void;
  logout: () => void;
  updateProfile: (updateObject: UpdateProfile) => void;
  online: string[];
  socket: Socket | null;
  connectSocket: () => void;
  disConnectSocket: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
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
      get().connectSocket(); // kết nối với socket luôn ngay sau khi vừa đăng nhập
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
      get().connectSocket(); // kết nối socket mỗi khi refresh lại trang
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
      get().connectSocket(); // kết nối với socket luôn sau khi truy cập
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
      localStorage.removeItem("main-theme");
      toast.success("Logout successfully");
      get().disConnectSocket(); // ngắt kết nối với socket khi đăng xuất
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  },
  updateProfile: async (updateObject: UpdateProfile) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await clientApi.patch("/user/update-profile", updateObject);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  online: [],
  socket: null,
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return;
    }

    const socket = io("http://localhost:5000", {
      query: {
        userId: authUser._id,
      },
    });
    set({ socket });
    if (socket) {
      socket.connect();
      socket.on("getAllOnline", (users: string[]) => {
        set({ online: users });
      });
    }
  },
  disConnectSocket: () => {
    if (get().socket?.connected) {
      get().socket?.disconnect();
    }
  },
}));
