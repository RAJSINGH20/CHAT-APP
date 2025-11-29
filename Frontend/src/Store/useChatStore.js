import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./UseAuthStore";

export const useChatStore = create((set,get) => ({
  message: [],
  users: [],
  selectedUsers: null,
  isuserLoading: false,
  isMessagesLoading: false,

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
    set({ isMessagesLoading: true, message: [] });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      // Ensure that message is always an array
      set({ message: Array.isArray(res.data) ? res.data : [] });
      console.log("Fetching messages for userId:", userId, "Current selectedUser:", get().selectedUsers)
      console.log("get message success", res);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }

  },
  sendMessage: async (messageData) => {
  const { selectedUsers, message } = get(); // renamed for clarity
  try {
    console.log("sending message", messageData, "to user:", selectedUsers);
    // POST because you're creating/sending
    console.log("send...................................")
    const res = await axiosInstance.post(`/messages/send/${selectedUsers._id}`, messageData);
    
    // append the new message payload
    set({ message: [...message, res.data] });

    console.log("send message success", res.data);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to send");
  }
},

  subscribeToMessages: () => {
    const { selectedUsers } = get();
    if (!selectedUsers) return;

    const socket = useAuthStore.getState().socket;

    // Remove any previous listener to avoid duplicates
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      // Only add messages from the currently selected user (either sent or received)
      const { selectedUsers, message } = get();
      if (
      !selectedUsers ||
      (newMessage.senderId !== selectedUsers._id && newMessage.receiverId !== selectedUsers._id)
      ) {
      return;
      }

      set({
      message: [...message, newMessage],
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
