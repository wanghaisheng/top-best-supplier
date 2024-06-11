"use client";
import React, { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Loading from "@/app/dashboard/loading";
import { NEXT_PUBLIC_GET_TOPIC } from "@/constants";
import { useSingleSWRAdmin } from "@/app/utils/fetcher";
import TinyMCEEditor from "@/app/utils/tinymce";
import { toast } from "sonner";
import { TopicModel } from "@/app/models/topic_model";
import { postTopics } from "@/app/roadmap/topics_roadmap";

export default function FromTopic({
  params,
}: {
  params: { topic_id: string };
}) {
  const router = useRouter();
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");

  const url = `${NEXT_PUBLIC_GET_TOPIC}?topicId=${params.topic_id}&process=no`;

  // Slice topics array for current page
  const { result, loading } = useSingleSWRAdmin(url);

  if (loading) {
    return <Loading />;
  }

  if (!result || result == "not_found") {
    notFound();
  }

  const data = result;
  const iniTitle = data.title;
  const iniDescription = data.description;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData: TopicModel = {
      _id: data._id,
      description: description,
      title: title,
    };

    try {
      const { response } = await postTopics(submitData);

      if (response.success) {
        toast.success(`${title} updated`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <p className="my-10">Topic: {data.title}</p>

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
              defaultValue={iniTitle}
              onChange={(e) => setTitle(e.target.value)}
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
              initialValue={iniDescription}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
