import { useEffect, useRef, type ReactElement } from "react";
import { useChatStore } from "../store/useChat";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/helper";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  // để auto scroll tin nhắn
  const messageContainer = useRef<HTMLDivElement>(null);
  if (isMessageLoading) {
  }
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);
  useEffect(() => {
    if (messageContainer.current && messages) {
      messageContainer.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessageLoading) {
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`chat ${authUser && message.senderId === authUser._id ? "chat-end" : "chat-start"} `}
              ref={messageContainer}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      authUser && message.senderId === authUser._id
                        ? authUser.profilePic || "/Default_avt.png"
                        : selectedUser.profilePic || "/Default_avt.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>
              <div className="chat-header mb-1 ">
                <time className="text-xs opacity-50 ml-1">
                  {message.createdAt
                    ? formatMessageTime(message.createdAt as string)
                    : "Sending..."}
                </time>
              </div>
              {message.image && (
                <img
                  src={message.image}
                  className="sm:max-w-[200px] rounded-md mt-4"
                />
              )}
              <div className="chat-bubble flex flex-col">
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
}
