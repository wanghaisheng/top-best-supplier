"use client";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { usePaginatedSWR } from "../utils/fetcher";
import Shimmer from "../components/shimmer";
import { useState } from "react";
import usePagination from "../utils/pagination";
import Image from "next/image";
import { getS3Url } from "../lib/repo/files_repo";

export default function QandAs({ listData }) {
  const perPage = 5;
  const page = 1;
  let data: any = [];

  let topicSlug = listData.topicData.slug;
  let listSlug = listData.slug;

  if (listData.qanda !== undefined && Array.isArray(listData.qanda.result)) {
    data = listData.qanda.result;

    topicSlug = listData.topicData.slug;
    listSlug = listData.slug;
  }

  return (
    <ul>
      {data &&
        data.map(
          (
            {
              _id,
              title,
              description,
              slug,
              extraClass,
              featuredImagePath,
              body,
            }: any,
            index: number
          ) => {
            const data = JSON.parse(body);
            const dataTitle = ` ${title} `;
            const url = `/${topicSlug}/${listSlug}/${slug}`;
            return (
              <li key={_id} id={slug}>
                <article className="relative bg-white pb-3 w-full shadow-xl ring-1 ring-gray-900/5 mb-10 rounded">
                  <div
                    className={`${extraClass} bg-gray-500 flex items-left justify-left gap-x-4 px-2 py-2 text-xs font-bold text-left text-white`}
                  >
                    <Link
                      prefetch={true}
                      href={url}
                      className="text-white font-extrabold capitalize"
                    >
                      {dataTitle}
                    </Link>
                  </div>
                  {featuredImagePath && (
                    <div className="mb-1">
                      <Image
                        src={getS3Url(featuredImagePath)}
                        alt={title}
                        style={{ width: "100%" }}
                        width={500}
                        height={200}
                        className="w-full rounded-sm object-cover"
                        priority
                      />
                    </div>
                  )}
                  <div className="group relative pt-2 space-y-2 py-2 px-2 text-base text-gray-600">
                    <section
                      className={`${extraClass} mt-1 line-clamp-3 text-sm leading-6 text-gray-600`}
                    >
                      <div
                        className="mb-3"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(data[0].dataBody),
                        }}
                      />

                      <div className="text-right">
                        {" "}
                        <Link
                          prefetch={true}
                          href={url}
                          className="text-red-500 font-medium"
                        >
                          visit page
                        </Link>
                      </div>
                    </section>
                  </div>
                </article>
              </li>
            );
          }
        )}
    </ul>
  );
}
