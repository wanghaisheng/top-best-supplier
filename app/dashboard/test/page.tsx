"use client";
import fetcher from "@/app/utils/fetch";
import useSWR from "swr";

export default function Home() {
  const url = "http://localhost:3000/api/get/get_topics";

  const { data, error } = useSWR(url, fetcher);
  if (data) {
    console.log(data.data);
  }
  return <div>Ji</div>;
}
