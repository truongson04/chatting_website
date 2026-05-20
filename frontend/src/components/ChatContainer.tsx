import { useEffect } from "react";
import { useChatStore } from "../store/useChat";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/helper";

export default function ChatContainer() {
  const { messages, getMessages, isMessageLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  if (isMessageLoading) {
  }
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);
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
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} `}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/Default_avt.png"
                        : selectedUser.profilePic || "/Default_avt.png"
                    }
                    alt="profile"
                  />
                </div>
              </div>
              <div className="chat-header mb-1 ">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(
                    (message.createdAt as Date).toLocaleString(),
                  )}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
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
