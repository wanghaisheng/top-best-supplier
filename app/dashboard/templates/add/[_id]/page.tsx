"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/dashboard/loading";
import ListsImport from "@/app/dashboard/lists/list_import";
import { NEXT_PUBLIC_GET_TEMPLATE } from "@/constants";
import { useSingleSWRAdmin } from "@/app/utils/fetcher";
import TemplateBody from "../../body";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import Shimmer from "@/app/components/shimmer";
import TemplatesImport from "@/app/dashboard/templates/template_import";

export default function TemplateOverview({
  params,
}: {
  params: { _id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  let [data, setData] = useState(Shimmer(10));

  const url = `${NEXT_PUBLIC_GET_TEMPLATE}?id=${params._id}`;

  // Slice topics array for current page
  const { result, loading } = useSingleSWRAdmin(url);

  if (loading) {
    return <Loading />;
  }

  if (!result) {
    return <div> Template not found</div>;
  }

  data = result;

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "template",
      component: <TemplateBody data={data} />,
    },
    {
      id: 2,
      status: "inactive",
      title: "template",
      component: <TemplateBody data={data} />,
    },
    {
      id: 3,
      status: "inactive",
      title: "template",
      component: <TemplateBody data={[]} />,
    },
    {
      id: 4,
      status: "inactive",
      title: "template",
      component: <TemplatesImport />,
    },
  ];

  return <TabbedContents tabComponents={tabComponents} />;
}
