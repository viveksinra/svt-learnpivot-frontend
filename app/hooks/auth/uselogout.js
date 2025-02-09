import Cookies from "js-cookie";

export const useLogout = () => {
  const logout = () => {
    Cookies.remove("currentUser");
    window.location.reload(); // Perform a hard refresh after logout
  };

  return { logout };
};
