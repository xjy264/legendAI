import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { createGuestbookEntry } from "@/lib/guestbook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 1 || message.length < 3) {
    return NextResponse.redirect(new URL("/guestbook?posted=0", request.url), 303);
  }

  await createGuestbookEntry({ name, message });
  revalidatePath("/");
  revalidatePath("/guestbook");

  return NextResponse.redirect(new URL("/guestbook?posted=1", request.url), 303);
}
