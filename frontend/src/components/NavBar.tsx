import { useAuthStore } from "../store/useAuthStore";

export default function NavBar() {
  const { authUser } = useAuthStore();
  return <h1>Nav bar</h1>;
}
