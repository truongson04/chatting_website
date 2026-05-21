import React, { useRef, useState, type FormEvent } from "react";
import { useChatStore, type Message } from "../store/useChat";
import { Image, Send, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export default function MessageInput() {
  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { authUser } = useAuthStore();
  const { sendMessage, selectedUser } = useChatStore();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("We only want image file ");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const base64 = reader.result;
          setImagePreview(base64 as string);
        }
      };
    }
  };
  const removeImage = () => {
    setImagePreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) {
      return;
    }
    try {
      if (authUser && selectedUser) {
        const newMessage: Message = {
          senderId: authUser._id,
          receiveId: selectedUser._id,
          text: text.trim(),
          image: imagePreview as string,
        };
        await sendMessage(newMessage);
        setText("");
        setImagePreview(undefined);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
      console.log(error);
    }
  };
  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={` sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}
