import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

export default function LogoutRoute() {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NETLY_HOST}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        return
      }
    } catch (_error) {
      return
    }
  
    return navigate('/')
  }

  return (
    <button onClick={handleLogout}  className="w-full flex items-center  space-x-2">
      <LogOut />
      <span>Logout</span>
    </button>
  );
}
