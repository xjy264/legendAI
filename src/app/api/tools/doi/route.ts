import { NextRequest } from "next/server";

import { lookupCitationByDoi } from "@/lib/citation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const doi = request.nextUrl.searchParams.get("doi") ?? "";

  try {
    const result = await lookupCitationByDoi(doi);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch-failed";
    const status = message === "invalid-doi" ? 400 : 502;
    return Response.json({ error: message }, { status });
  }
}
