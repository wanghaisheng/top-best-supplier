"use client";
import React, { useState } from "react";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import ListsView from "./lists_view";
import CreateTopic from "../topics/create_topic";
import CreateList from "./create_list";

function Index() {
  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "lists",
      component: <ListsView topicId={""} />,
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
      component: <></>,
    },
    {
      id: 4,
      status: "active",
      title: "create list",
      component: <CreateList topicData={{}} />,
    },
  ];

  return (
    <>
      <TabbedContents title="Lists" tabComponents={tabComponents} />
    </>
  );
}
export default Index;
