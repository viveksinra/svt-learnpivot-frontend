import Cookies from "js-cookie";

export function canAccess(pageName, action) {
  const accessControl = Cookies.get("roleData");
  // console.log(accessControl);
  let access = false;
  // accessControl.forEach((access) => {
  //   if (access.resource === pageName) {
  //     access.actions.forEach((roleAction) => {
  //       if (roleAction === action) {
  //         access = true;
  //       }
  //     });
  //   }
  // });
  return access;
}
