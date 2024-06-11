"use client";
import React, { useEffect, useState } from "react";
import TopicsImport from "../../../topics/topics_import";
import { useRouter } from "next/navigation";
import { getTop } from "@/app/lib/repo/tops_repo";
import Loading from "@/app/dashboard/loading";
import { TopModel } from "@/app/models/top_model";
import TopicsView from "@/app/dashboard/topics/topics_view";
import CreateTopic from "@/app/dashboard/topics/create_topic";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import { NEXT_PUBLIC_GET_TOP, NEXT_PUBLIC_GET_TOPS } from "@/constants";
import {
  usePaginatedSWRAdmin,
  useSingleSWR,
  useSingleSWRAdmin,
} from "@/app/utils/fetcher";

export default function FromTop({ params }: { params: { top_id: string } }) {
  const router = useRouter();
  let [topData, setTopData] = useState<TopModel | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const url = `${NEXT_PUBLIC_GET_TOP}?id=${params.top_id}`;

  const { result, loading } = useSingleSWRAdmin(url);

  if (result) {
    topData = result;
  }

  if (!topData) {
    return <Loading />;
  }

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "topics",
      component: <TopicsView topId={params.top_id} />,
    },
    {
      id: 2,
      status: "inactive",
      title: "",
      component: <></>,
    },
    {
      id: 3,
      status: "inactive",
      title: "",
      component: <CreateTopic topData={topData} />,
    },
    {
      id: 4,
      status: "active",
      title: "topics import",
      component: <TopicsImport top_id={params.top_id} />,
    },
  ];

  return (
    <TabbedContents
      title={String(topData.title)}
      tabComponents={tabComponents}
    />
  );
}
