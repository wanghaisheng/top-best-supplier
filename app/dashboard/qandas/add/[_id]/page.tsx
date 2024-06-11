"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/dashboard/loading";
import { NEXT_PUBLIC_GET_LIST, NEXT_PUBLIC_GET_QANDA } from "@/constants";
import { useSingleSWRAdmin } from "@/app/utils/fetcher";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import Shimmer, { SingleShimmer } from "@/app/components/shimmer";

import QandAsImport from "../../qanda_import";

import QandAView from "../../qandas_view";

export default function QandAsOverview({
  params,
}: {
  params: { _id: string };
}) {
  let [data, setData] = useState(SingleShimmer(10));

  const url = `${NEXT_PUBLIC_GET_LIST}?listId=${params._id}`;

  // Slice topics array for current page
  const { result, loading } = useSingleSWRAdmin(url);

  if (loading) {
    return <Loading />;
  }

  if (!result) {
    return <div> Qanda not found</div>;
  }

  data = result;

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "questions",
      component: <QandAView listId={params._id} />,
    },

    {
      id: 2,
      status: "inactive",
      title: "steps",
      component: <></>,
    },
    {
      id: 3,
      status: "inactive",
      title: "Steps Import",
      component: <></>,
    },
    {
      id: 4,
      status: "active",
      title: "QandA Import",
      component: <QandAsImport listId={params._id} />,
    },
  ];

  return <TabbedContents title={data.title} tabComponents={tabComponents} />;
}
