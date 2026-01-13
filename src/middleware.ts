import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const legacyPrefixes = ["/unauthorized", "/version"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isSkipPath = legacyPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isSkipPath ) {
    return NextResponse.next();
  }
  const secret = process.env.NEXTAUTH_SECRET;
  const session = await getToken({ req: request, secret });
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/"],
};
