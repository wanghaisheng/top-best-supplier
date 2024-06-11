"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTopic } from "@/app/lib/repo/topics_repo";
import Loading from "@/app/dashboard/loading";
import { TopicModel } from "@/app/models/topic_model";
import ListsImport from "@/app/dashboard/lists/list_import";
import { toast } from "sonner";
import ListsView from "@/app/dashboard/lists/lists_view";
import { NEXT_PUBLIC_GET_TOPIC } from "@/constants";
import { useSingleSWRAdmin } from "@/app/utils/fetcher";
import AddList from "@/app/dashboard/lists/create_list";

export default function FromTopic({
  params,
}: {
  params: { topic_id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const url = `${NEXT_PUBLIC_GET_TOPIC}?topicId=${params.topic_id}`;

  // Slice topics array for current page
  const { result, loading } = useSingleSWRAdmin(url);

  if (loading) {
    return <Loading />;
  }

  if (!result) {
    return <div>No Topic found</div>;
  }

  const topicData = result;

  return (
    <div className="container mx-auto mt-12">
      <p className="my-10">Topic: {topicData.title}</p>
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <button
            className={`px-2 py-1.5 text-sm rounded-sm ${
              activeTab === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Published Lists
          </button>

          <button
            className={`px-2 py-1.5 text-sm rounded-sm ${
              activeTab === 2
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Draft Lists
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="float-right">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <button
                  className={`px-2 py-1.5 text-sm rounded-sm ${
                    activeTab === 3
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTabClick(3)}
                >
                  Create List
                </button>

                <button
                  className={`px-2 py-1.5 text-sm rounded-sm ${
                    activeTab === 4
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTabClick(4)}
                >
                  Import Lists
                </button>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
      {/* Content for each tab */}
      {activeTab === 1 && (
        <div className="mt-10">
          <ListsView topicId={params.topic_id} />
        </div>
      )}
      {activeTab === 2 && <div className="mt-10">Content for Tab 2</div>}
      {activeTab === 3 && (
        <div className="mt-10">
          <AddList topicData={topicData} />
        </div>
      )}
      {activeTab === 4 && (
        <div className="mt-10">
          <ListsImport topicId={params.topic_id} />
        </div>
      )}
    </div>
  );
}
