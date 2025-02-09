import { authService } from "../../services";

import Cookies from "js-cookie";

export const useLogin = () => {
  const getOtp = async (mobile) => {
    const response = await authService.getOtp(mobile);
    return response;
  };
  const login = async (email, password) => {
    const user = await authService.login(email, password);
    if (user) {
      Cookies.set("currentUser", JSON.stringify(user));
      Cookies.set("roleData", JSON.stringify(user.roleData));
    }
    return user;
  };

  return { getOtp, login };
};
