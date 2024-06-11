"use client";
import React, { useEffect, useState } from "react";
import { notFound, redirect, useRouter } from "next/navigation";
import TinyMCEEditor from "@/app/utils/tinymce";
import { toast } from "sonner";
import TopicsDataSearch from "@/app/components/widgets/select_search";
import { NEXT_PUBLIC_GET_TOPS } from "@/constants";
import Shimmer from "@/app/components/shimmer";
import { usePaginatedSWR, usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { isNull } from "@/app/utils/custom_helpers";
import { postTopics } from "@/app/roadmap/topics_roadmap";

export default function AddTopic({ topData }) {
  const router = useRouter();
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [selectedItem, setSelected] = useState({});
  const [page, setPage] = useState(1);
  const perPage = 5;
  let [url, setUrl] = useState(
    `${NEXT_PUBLIC_GET_TOPS}?page=${page}&perPage=${perPage}`
  );

  let searchData = [];
  // Slice topics array for current page
  const { paginatedData, loading, data } = usePaginatedSWRAdmin(
    url,
    page,
    perPage
  );

  if (paginatedData && paginatedData.length > 0) {
    searchData = paginatedData;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = {
      description: description,
      title: title,
      topId: topData._id,
    };

    try {
      const response = await postTopics(submitData);

      if (response.data) {
        toast.success("topic created");
        router.push("/dashboard/topics");
      } else {
        toast.error("error creating topic");
      }
    } catch (error) {
      console.log(error);
    }
  };

  function handleSearch(value) {
    if (!isNull(value)) {
      const url = `${NEXT_PUBLIC_GET_TOPS}?page=${page}&perPage=${perPage}&q=${value}`;
      setUrl(url);
    } else {
      const url = `${NEXT_PUBLIC_GET_TOPS}?page=${page}&perPage=${perPage}`;
      setUrl(url);
    }
  }

  function selected(value) {
    console.log(value);
  }
  return (
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <p className="my-10">Add a new Topic</p>

        <form method="POST" className="mx-auto px-10" onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              className="block mb-2 uppercase font-bold text-xs text-gray-700"
              htmlFor="title"
            >
              Title
            </label>

            <input
              className="border border-gray-400 p-2 w-full rounded"
              type="text"
              id="title"
              name="title"
              defaultValue={""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label
              className="block mb-2 uppercase font-bold text-xs text-gray-700"
              htmlFor="title"
            >
              Top
            </label>

            <TopicsDataSearch
              data={searchData}
              onChange={(e) => handleSearch(e.target.value)}
              selected={selectedItem}
              setSelected={() => {}}
            />
          </div>

          <div className="mb-5">
            <label
              className="block mb-2 uppercase font-bold text-xs text-gray-700"
              htmlFor="body"
            >
              Body
            </label>

            <TinyMCEEditor
              onChange={(newValue) => setDescription(newValue)}
              initialValue={""}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
