import Cookies from "js-cookie";

export function getAuthorizationHeader() {
  const currentUser = Cookies.get("currentUser");

  return {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `${JSON.parse(currentUser || "")?.token || ""}`,
  };
}

export function getHeaderUrlEncoded() {
  return {
    "Content-Type": "application/x-www-form-urlencoded",
  };
}
