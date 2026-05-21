import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Files, Mail, User } from "lucide-react";
export interface UpdateProfile {
  profilePic: string | ArrayBuffer | null;
}

export default function ProfilePage() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer>();
  const handleUpdateProfile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    // hàm để xử lý hình ảnh
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = async () => {
        const base64Image = reader.result;
        if (base64Image) {
          setSelectedImage(base64Image);
        }
        const updateObject: UpdateProfile = {
          profilePic: base64Image,
        };
        await updateProfile(updateObject);
      };
    }
  };

  return (
    <>
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8 ">
            <div className="text-center">
              <h1 className="text-2xl font-semibold"> Profile</h1>
              <p className="mt-2"> Your profile information</p>
            </div>
            {/* avatar section  */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={
                    (selectedImage as string) ||
                    (authUser.profilePic as string) ||
                    "/Default_avt.png"
                  }
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                  onError={(e) => {
                    e.currentTarget.src = "/Default_avt.png";
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Camera className="w-5 h-5 text-base-200" />

                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? "Uploading...."
                  : "Click the camera to update your photo"}
              </p>
            </div>
            {/* additional information */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex justify-center gap-2 flex-col">
                  <div className="flex gap-2">
                    <User className="w-4 h-4" />
                    Full Name:
                  </div>

                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                    {authUser.fullName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex justify-center gap-2 flex-col">
                    <div className="flex gap-2 ">
                      <Mail className="w-4 h-4" />
                      Email:
                    </div>

                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                      {authUser.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
