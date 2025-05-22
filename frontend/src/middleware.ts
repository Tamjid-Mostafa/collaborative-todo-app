import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  console.log({ token: req.cookies });
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    console.log({ payload });
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload?.sub as string);
    requestHeaders.set("x-user-role", payload?.role as string);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    return response;
  } catch (error) {
    console.log({ error });
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/todos/:path*", "/dashboard/:path*"],
};
