import { useAuthStore } from "../store/useAuthStore";

export default function ProfilePage() {
  const { authUser } = useAuthStore();

  return <h1>Profile Page</h1>;
}
