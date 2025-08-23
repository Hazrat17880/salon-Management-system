import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/user/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Logged out successfully");
        // Clear localStorage if you’re storing tokens there too
        localStorage.removeItem("user");
        // Redirect after short delay
        setTimeout(() => {
          router.push("/user/signin");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to logout");
      }
    } catch (error) {
      toast.error("Something went wrong while logging out");
    }
  };

  return logout;
};

export default useLogout;
