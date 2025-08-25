import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
  message: [],
  users: [],
  selectedUsers: null,
  isuserLoading: false,
  ismessagesLoading: false,

  getusers: async () => {
    set({ isuserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isuserLoading: false });
    }
  },

  getMessages:async (userId) => {
    set({ ismessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ message: res.data });
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({ ismessagesLoading: false });
    }
  },
  //optomized this one later 
  setSelectedUser: (selectedUser) => {
    set({ selectedUsers: selectedUser });
  },


}));
