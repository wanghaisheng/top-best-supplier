"use server";

import { revalidateTag } from "next/cache";

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  let tag = searchParams.get("tag") || "none";
  const rev = revalidateTag(tag);
  return new Response(JSON.stringify({ success: true, mgs: rev, tag: tag }), {
    status: 200,
  });
}
