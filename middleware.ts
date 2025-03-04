import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    // Customize the response if needed
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/signin", // Redirect unauthenticated users to login
    },
  }
);

export const config = {
  matcher: ["/blog/add"], // Protect specific routes
};