import { useChatStore } from "../store/useChat";
import ChatContainer from "./ChatContainer";
import NoChat from "./NoChat";
import SideBar from "./SideBar";

export default function HomePage() {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh -8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />
            {selectedUser ? <ChatContainer /> : <NoChat />}
          </div>
        </div>
      </div>
    </div>
  );
}
