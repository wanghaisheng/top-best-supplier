"use client";
import { NEXT_PUBLIC_GET_TOPICS } from "@/constants";
import Link from "next/link";
import { usePaginatedSWR } from "@/app/utils/fetcher";
import { useState } from "react";
import Shimmer from "../components/shimmer";
import usePagination from "../utils/pagination";

export default function Topics({ topId, topicData }) {
  const perPage = 5;
  const page = 1;
  let [data, setData] = useState(Shimmer(perPage));

  if (
    topicData.topTopics !== undefined &&
    Array.isArray(topicData.topTopics.result) &&
    topicData.topTopics.result.length > 0
  ) {
    data = topicData.topTopics.result;
  }

  const paginatedData = usePagination(data, page, perPage);

  return (
    <ul className="ml-1 inline-block w-[500px]">
      {paginatedData.map(({ _id, title, slug, extraClass }) => {
        return (
          <li key={_id} className="py-2">
            <Link prefetch={true} href={`/${slug}`}>
              <div className={`flex items-center ${extraClass}`}>
                <div className="bg-red-500 w-1 h-1 mr-2 text-sm"></div>
                <div className="align-middle line-clamp-1 text-transform: lowercase">
                  {title}
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
