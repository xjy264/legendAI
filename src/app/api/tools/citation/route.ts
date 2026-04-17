import { NextResponse } from "next/server";

import { buildCitationResult, normalizeDoi, type CrossrefWork } from "@/lib/citation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const doi = normalizeDoi(url.searchParams.get("doi") ?? "");

  if (!doi) {
    return NextResponse.json(
      { error: "invalid-doi", message: "Enter a valid DOI." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: "not-found", message: "No metadata was found for that DOI." },
        { status: 404 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "fetch-failed", message: `Crossref returned ${response.status}.` },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as { message?: CrossrefWork };
    if (!payload.message) {
      return NextResponse.json(
        { error: "missing-data", message: "Crossref returned an empty payload." },
        { status: 502 },
      );
    }

    return NextResponse.json({ citation: buildCitationResult(payload.message) });
  } catch {
    return NextResponse.json(
      { error: "network-error", message: "Unable to reach Crossref right now." },
      { status: 502 },
    );
  }
}
