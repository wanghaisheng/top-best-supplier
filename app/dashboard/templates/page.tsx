"use client";
import React, { useState } from "react";
import Pagination from "rc-pagination";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Loading from "../loading";
import {
  DASH_TOPICS,
  NEXT_PUBLIC_GET_TEMPLATES,
  NEXT_PUBLIC_GET_TOPICS,
} from "@/constants";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { notFound, useRouter } from "next/navigation";
import ConfirmAction from "@/app/components/widgets/confirm";
import { toast } from "sonner";
import { ActionButtons } from "@/app/components/widgets/action_buttons";
import { removeById } from "@/app/utils/custom_helpers";
import Shimmer from "@/app/components/shimmer";
import DataTable from "@/app/components/widgets/data_table";
import TemplateBody from "./body";
import TemplatesImport from "./template_import";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import { deleteTopics } from "@/app/lib/repo/topics_repo";

export const dynamic = "force-dynamic";

export default function TemplatesView({ topId }) {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  let [data, setData] = useState(Shimmer(5));
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const perPage = 10;
  const url = `${NEXT_PUBLIC_GET_TEMPLATES}?page=${page}&perPage=${perPage}`;

  // Slice topics array for current page
  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (loading || !Array.isArray(paginatedData)) {
    return <Loading />;
  }

  if (updating === false) {
    data = paginatedData;
  }

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "templates",
      component: (
        <DataTable
          data={data}
          page={page}
          perPage={perPage}
          deleteAction={deleteAction}
          setPage={() => setPage}
          viewAction={viewAction}
          editAction={editAction}
          addAction={addAction}
          addText={"bodies"}
        />
      ),
    },
    {
      id: 2,
      status: "inactive",
      title: "templates",
      component: <TemplateBody data={data} />,
    },
    {
      id: 3,
      status: "inactive",
      title: "templates",
      component: <TemplateBody data={[]} />,
    },
    {
      id: 4,
      status: "active",
      title: "import template",
      component: <TemplatesImport />,
    },
  ];

  return (
    <>
      <TabbedContents title="Templates" tabComponents={tabComponents} />
    </>
  );

  async function deleteAction(_id: string) {
    setUpdating(true);
    const updatedImports = removeById(data, _id);
    setData(updatedImports);
    const res = await deleteTopics(_id);
    if (res.data) {
      const updatedData = removeById(paginatedData, _id);
      data = updatedData;
      toast.success(`${res.data} items deleted`);
      router.push(`${DASH_TOPICS}`);
    } else {
      toast.error(` items not deleted`);
    }
  }
  async function viewAction(slug: string) {
    router.push(`/${slug}`);
  }

  async function editAction(_id: string) {
    router.push(`/dashboard/topics/edit/${_id}`);
  }

  async function addAction(_id: string) {
    router.push(`/dashboard/templates/add/${_id}`);
  }
}
