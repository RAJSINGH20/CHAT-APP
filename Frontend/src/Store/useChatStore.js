import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore";
import axios from "axios";

export const useChatStore = create((set,get) => ({
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

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`/api/messages/${userId}`);

      console.log("Fetching messages for userId:", userId, "Current selectedUser:", get().selectedUsers)
      set({ messages: res.data });
      console.log("get message sucess", res);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }

  },
  sendMessage: async (messageData) => {
    const { selectedUser,   message } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ message: [...message, res.data] });
      console.log("send message sucess", res);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  //optomized this one later 
  setSelectedUser: (selectedUser) => {
    console.log("Setting selected user:", selectedUser);
    set({ selectedUsers: selectedUser });
  },


}));
