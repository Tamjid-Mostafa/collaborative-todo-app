import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  // If token exists and user is on sign-in or sign-up page, redirect to ToDo page
  if (token && ["/sign-in", "/sign-up"].includes(req.nextUrl.pathname)) {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload?.sub) {
        return NextResponse.redirect(new URL("/todos", req.url));
      }
    } catch (err) {
      // Invalid token, let them access sign-in
    }
  }

  if (!token && req.nextUrl.pathname.startsWith("/todos")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const { payload } = await jwtVerify(token!, secret);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload?.sub as string);
    requestHeaders.set("x-user-role", payload?.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/todos/:path*", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
