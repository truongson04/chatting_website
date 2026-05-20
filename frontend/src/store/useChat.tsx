import { create } from "zustand";
import clientApi from "../lib/axios";
import axios from "axios";
import { toast } from "react-hot-toast";
export interface Users {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}
export interface Message {
  _id?: string;
  senderId: string;
  receiveId: string;
  text: string;
  image: string;
}
interface ChatStore {
  messages: Message[];
  selectedUser: any;
  users: Users[];
  isUserLoading: boolean;
  isMessageLoading: boolean;
  getUsers: () => void;
  getMessages: (userId: string) => void;
  setSelectedUser: (selectedUser: any) => void;
  sendMessage: (message: Message) => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  messages: [],
  selectedUser: null,
  users: [],
  isUserLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await clientApi.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessageLoading: true });
    try {
      const res = await clientApi.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser: selectedUser });
  },
  sendMessage: async (message: Message) => {
    const { selectedUser, messages } = get();
    try {
      const res = await clientApi.post(
        `/message/send/${selectedUser._id}`,
        message,
      );
      set({ messages: [...messages, res.data] });
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
