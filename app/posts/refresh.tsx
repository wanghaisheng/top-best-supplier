"use client";
import { revalidateTag } from "next/cache";
import { base_url } from "../utils/custom_helpers";
import { redirect, useRouter } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Revalidate({ tag, url }) {
  const router = useRouter();
  const refresh = async () => {
    try {
      const rev = await fetch(base_url(`/api/actions?tag=${tag}`)); // Assuming you're using fetch API
      if (!rev.ok) {
      }
      router.prefetch(`${url}?action=revalidated`);
      router.refresh();
      router.push(`${url}?action=revalidated`);
    } catch (error) {
      console.error("An error occurred while refreshing:", error);
    }
  };

  return (
    <div
      className="h-6 w-20 flex justify-center items-center bottom-1 text-sm border border-red-500 hover:border-red-700 rounded-lg shadow-md cursor-pointer"
      onClick={refresh}
    >
      <ArrowPathIcon className="h-full w-full text-red-500 ml-1" />
      <a className="p-2" rel="nofollow">
        Refresh
      </a>
    </div>
  );
}
