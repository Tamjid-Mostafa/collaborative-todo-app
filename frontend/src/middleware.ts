import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  if (token && ["/sign-in", "/sign-up"].includes(pathname)) {
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload?.sub) {
        return NextResponse.redirect(new URL("/todos", req.url));
      }
    } catch {
    }
  }
  if (pathname.startsWith("/todos")) {
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, secret);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload?.sub as string);
      if (payload?.role) {
        requestHeaders.set("x-user-role", payload?.role as string);
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.cookies.delete("access_token");
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/todos/:path*", "/sign-in", "/sign-up"],
};
