"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/app/dashboard/loading";
import { NEXT_PUBLIC_GET_LIST, NEXT_PUBLIC_GET_QANDA } from "@/constants";
import { useSingleSWRAdmin } from "@/app/utils/fetcher";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import Shimmer, { SingleShimmer } from "@/app/components/shimmer";
import StepsImport from "../../steps_import";
import Steps from "../../steps";
import QandAView from "../../qandas_view";
import QandAsBody from "../../body";

export default function StepsAndAns({ params }: { params: { _id: string } }) {
  let [data, setData] = useState(SingleShimmer(10));

  const url = `${NEXT_PUBLIC_GET_QANDA}?id=${params._id}`;

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
      component: <QandAsBody data={data} />,
    },

    {
      id: 2,
      status: "active",
      title: "steps",
      component: <Steps data={data} />,
    },
    {
      id: 3,
      status: "active",
      title: "Steps Import",
      component: <StepsImport qanda={data} />,
    },
    {
      id: 4,
      status: "inactive",
      title: "QandA Import",
      component: <></>,
    },
  ];

  return <TabbedContents title={data.title} tabComponents={tabComponents} />;
}
