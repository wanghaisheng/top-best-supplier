import { Key, useState } from "react";
import PostListItem from "@/app/posts/post_lists_items";
import { NEXT_PUBLIC_GET_POPULAR_LISTS } from "@/constants";
import { usePaginatedSWR } from "../utils/fetcher";
import Shimmer from "./shimmer";
import { getPopularLists } from "../lib/repo/lists_repo";
//import { getPopularLists } from "../lib/repo/lists_repo";

export default async function PopularLists({ _id, showNumber = false }) {
  const perPage = 3;
  const page = 1;

  let data = await getPopularLists(_id, page, perPage);

  return (
    <div className="relative flex sm:py-7">
      <div className="relative px-1 pb-2 pt-2 sm:mx-auto w-full sm:px-2">
        <div className="relative bg-white pb-3 shadow-xl ring-1 ring-gray-900/5 mb-10 rounded">
          <div className="bg-gray-500 flex items-left justify-left gap-x-4 px-4 py-2 text-xs font-bold text-left text-white">
            Popular Lists
          </div>
          <div className="group relative pt-2 space-y-2 py-2 px-2 text-base text-gray-600">
            <div className="line-clamp-1 text-sm leading-6 text-gray-600">
              <ul className="ml-1 inline-block w-[500px]">
                {data && data.result ? (
                  data.result.map((post) => {
                    const modifiedPost = {
                      ...post,
                      slug: `${post.postSlug}`,
                    };
                    return (
                      <PostListItem
                        data={modifiedPost}
                        key={post._id}
                        showNumber={showNumber}
                      />
                    );
                  })
                ) : (
                  <div>no other list</div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
