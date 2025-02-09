import { NextResponse } from "next/server";
import { authRoutes, protectedRoutes, userProtectedRoutes, publicRoutes } from "./app/router/routes";

export function middleware(request) {
  const currentUser = parseCurrentUser(request);
  const { pathname } = request.nextUrl;
  
  const routeChecks = {
    isAdmin: currentUser?.jobRoleId === "admin",
    isUser: currentUser?.jobRoleId === "user",
    isProtectedRoute: protectedRoutes.includes(pathname),
    isUserProtectedRoute: userProtectedRoutes.includes(pathname),
    isAuthRoute: authRoutes.includes(pathname),
    isPublicRoute: publicRoutes.includes(pathname)
  };

  // Handle authentication and route access
  if ((routeChecks.isProtectedRoute || routeChecks.isUserProtectedRoute) && 
      (!currentUser || Date.now() > currentUser.expiredAt)) {
    return redirectToLogin(request);
  }

  // Handle auth routes when user is logged in
  if (routeChecks.isAuthRoute && currentUser) {
    return redirectBasedOnRole(currentUser, request);
  }

  // Handle user-specific route restrictions
  if (routeChecks.isUserProtectedRoute && !routeChecks.isUser) {
    return routeChecks.isAdmin 
      ? NextResponse.redirect(new URL("/dashboard", request.url)) 
      : redirectToLogin(request);
  }

  // Handle public routes for admin
  if (routeChecks.isPublicRoute && routeChecks.isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Handle admin-only route restrictions
  if (routeChecks.isProtectedRoute && !routeChecks.isAdmin) {
    return routeChecks.isUser
      ? NextResponse.redirect(new URL("/userDash", request.url))
      : redirectToLogin(request);
  }
}

function parseCurrentUser(request) {
  const currentUserCookie = request.cookies.get("currentUser")?.value;
  if (!currentUserCookie) return null;
  
  try {
    return JSON.parse(currentUserCookie);
  } catch (e) {
    console.error("Failed to parse currentUser cookie:", e);
    return null;
  }
}

function redirectToLogin(request) {
  request.cookies.delete("currentUser");
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("currentUser");
  return response;
}

function redirectBasedOnRole(user, request) {
  if (user.jobRoleId === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else if (user.jobRoleId === "user") {
    return NextResponse.redirect(new URL("/userDash", request.url));
  } else {
    return redirectToLogin(request);
  }
}