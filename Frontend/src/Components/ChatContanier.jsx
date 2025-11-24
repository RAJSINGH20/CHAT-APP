import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/UseAuthStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    message,
    getMessages,
    isMessagesLoading,
    selectedUsers,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUsers._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUsers._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (
      messageEndRef.current &&
      message &&
      Array.isArray(message) &&
      message.length > 0
    ) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {message.map((msg, index) => (
          <div
            key={msg._id || `${msg.senderId}-${msg.createdAt}`}
            className={`chat ${
              msg.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={index === message.length - 1 ? messageEndRef : null} // only last message gets the ref
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    msg.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUsers.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(msg.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
