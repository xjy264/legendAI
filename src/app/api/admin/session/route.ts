import { NextResponse } from "next/server";

import {
  adminSessionCookieName,
  adminSessionValueForPassword,
  getAdminReturnPath,
  isAdminPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const adminPath = getAdminReturnPath(request);

  if (!isAdminPassword(password)) {
    return NextResponse.redirect(new URL(`${adminPath}?error=bad-password`, request.url), 303);
  }

  const response = NextResponse.redirect(new URL(adminPath, request.url), 303);
  response.cookies.set(adminSessionCookieName, adminSessionValueForPassword(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
