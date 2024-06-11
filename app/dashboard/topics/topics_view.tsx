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
import { DASH_TOPICS, NEXT_PUBLIC_GET_TOPICS } from "@/constants";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { notFound, useRouter } from "next/navigation";
import ConfirmAction from "@/app/components/widgets/confirm";
import { toast } from "sonner";
import { ActionButtons } from "@/app/components/widgets/action_buttons";
import { deleteTopics } from "@/app/lib/repo/topics_repo";
import { dataToast, removeById } from "@/app/utils/custom_helpers";
import Shimmer from "@/app/components/shimmer";
import DataTable from "@/app/components/widgets/data_table";
import { TopicModel } from "@/app/models/topic_model";

export const dynamic = "force-dynamic";

export default function TopicsView({ topId }) {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  let [data, setData] = useState<TopicModel>();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const perPage = 10;
  const url = `${NEXT_PUBLIC_GET_TOPICS}?topId=${topId}&page=${page}&perPage=${perPage}`;

  // Slice topics array for current page
  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (loading || !Array.isArray(paginatedData)) {
    return <Loading />;
  }

  if (updating === false) {
    data = paginatedData as TopicModel;
  }

  if (paginatedData.length === 0) {
    return <div>No Topic found</div>;
  }

  return (
    <>
      <DataTable
        data={data}
        page={page}
        perPage={perPage}
        deleteAction={deleteAction}
        setPage={() => setPage}
        viewAction={viewAction}
        editAction={editAction}
        addAction={addAction}
        addText={"list Q&A"}
      />
    </>
  );

  async function deleteAction(_id: any) {
    setUpdating(true);
    const updatedImports = removeById(data, _id);
    setData(updatedImports);

    const { success, msg } = await deleteTopics(_id);
    dataToast(success, msg);
  }
  async function viewAction(slug: string) {
    router.push(`/${slug}`);
  }

  async function editAction(_id: string) {
    router.push(`/dashboard/topics/edit/${_id}`);
  }

  async function addAction(_id: string) {
    router.push(`/dashboard/topics/add/${_id}`);
  }
}
