"use client";
import { useEffect, Suspense } from "react"; // Import Suspense
import { redirect, useSearchParams } from "next/navigation";
import { base_url, isNull } from "../utils/custom_helpers";

export default function Page() {
  return (
    <Suspense fallback={<div>redirecting...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  // Create a separate component for content
  const searchParams = useSearchParams();

  if (searchParams) {
    const url = searchParams.get("url") || base_url();
    const utm_campaign = searchParams.get("utm_campaign") || "topingnow";
    return redirect(
      `${url}?utm_source=${"topingnow.com"}&utm_medium=referral&utm_campaign=${utm_campaign}`
    );
  }
  return redirect(base_url());
}
