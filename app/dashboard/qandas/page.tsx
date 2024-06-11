"use client";
import React, { useState } from "react";
import Shimmer from "@/app/components/shimmer";
import TemplateBody from "./body";
import QandAsImport from "./qanda_import";
import StepsImport from "./steps_import";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import QandAView from "./qandas_view";

export const dynamic = "force-dynamic";

export default function Page() {
  let [data, setData] = useState(Shimmer(5));

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "QandA",
      component: <QandAView listId={""} />,
    },
    {
      id: 2,
      status: "inactive",
      title: "QandA",
      component: <TemplateBody data={data} />,
    },
    {
      id: 3,
      status: "inactive",
      title: "Steps Import",
      component: <StepsImport qanda={data} />,
    },
    {
      id: 4,
      status: "inactive",
      title: "QandA Import",
      component: <QandAsImport listId={""} />,
    },
  ];

  return (
    <>
      <TabbedContents
        title="Questions and Answers"
        tabComponents={tabComponents}
      />
    </>
  );
}
