"use client";
import React, { useEffect, useState } from "react";

import TabbedContents from "@/app/components/widgets/tabbed_contents";
import ImportsView from "./imports_view";

export default function Index() {
  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "imports",
      component: <ImportsView />,
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
      title: "templates",
      component: <></>,
    },
    {
      id: 4,
      status: "inactive",
      title: "",
      component: <></>,
    },
  ];

  return (
    <>
      <TabbedContents title={"Imports"} tabComponents={tabComponents} />
    </>
  );
}
