"use client";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getTopic } from "@/app/lib/repo/topics_repo";
import Loading from "@/app/dashboard/loading";
import { TopicModel } from "@/app/models/topic_model";
import { toast } from "sonner";
//import { ListsView, AddList, ListsImport } from "@/app/roadmap/lists_roadmap";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import ListsView from "../../lists_view";
import ListsImport from "../../list_import";
import AddList from "@/app/dashboard/lists/create_list";

export default function CreatList({
  params,
}: {
  params: { topic_id: string };
}) {
  //  const router = useRouter();
  const [topicData, setTopicData] = useState<TopicModel | null>(null);

  useEffect(() => {
    getTopic(params.topic_id).then((data) => {
      if (!data) {
        toast.error("topic not found");
        redirect("/dashboard/topics");
      } else {
        setTopicData(data);
      }
    });
  }, [params.topic_id]);

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  if (!topicData) {
    return <Loading />;
  }

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "Published Lists",
      component: <ListsView topicId={params.topic_id} />,
    },

    {
      id: 2,
      status: "inactive",
      title: "steps",
      component: <></>,
    },
    {
      id: 3,
      status: "active",
      title: "Create List",
      component: <AddList topicData={topicData} />,
    },
    {
      id: 4,
      status: "active",
      title: "Import Lists",
      component: <ListsImport topicId={params.topic_id} />,
    },
  ];

  return (
    <TabbedContents
      title={topicData.title ?? "topic"}
      tabComponents={tabComponents}
    />
  );
}
