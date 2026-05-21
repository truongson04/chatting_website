import { useEffect, useRef } from "react";
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
  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);
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

  if (!authUser || !selectedUser) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageContainer}
          >
            {message.senderId !== authUser._id && (
              <>
                {" "}
                <div className=" chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/Default_avt.png"
                          : selectedUser.profilePic || "/Default_avt.png"
                      }
                      onError={(e) => {
                        e.currentTarget.src = "/Default_avt.png";
                      }}
                      alt="profile pic"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {message.createdAt
                  ? formatMessageTime(message.createdAt as string)
                  : "Sending..."}
              </time>
            </div>
            <div className=" flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && (
                <p
                  className={
                    message.senderId === authUser._id
                      ? "chat-bubble chat-bubble-primary"
                      : "chat-bubble"
                  }
                >
                  {message.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
