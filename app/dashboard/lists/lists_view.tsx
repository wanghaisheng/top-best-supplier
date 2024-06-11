"use client";
import React, { useEffect, useState } from "react";
import Pagination from "rc-pagination";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Loading from "../loading";
import { NEXT_PUBLIC_GET_LISTS } from "@/constants";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { useRouter } from "next/navigation";
import { ActionButtons } from "@/app/components/widgets/action_buttons";
import { deleteList } from "@/app/lib/repo/lists_repo";
import { removeById } from "@/app/utils/custom_helpers";
import { toast } from "sonner";
import DataTable from "@/app/components/widgets/data_table";
import Shimmer from "@/app/components/shimmer";

export default function ListsView({ topicId }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  let [data, setData] = useState([]);
  const perPage = 10;
  const [updating, setUpdating] = useState(false);

  const url = `${NEXT_PUBLIC_GET_LISTS}?topicId=${topicId}&page=${page}&perPage=${perPage}`;

  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (updating === false) {
    data = paginatedData;
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
        addText={"Q&A"}
      />
    </>
  );

  async function deleteAction(_id: string) {
    setUpdating(true);
    const updatedImports = removeById(data, _id);

    setData(updatedImports);

    await deleteList(_id);

    toast.success(`item deleted`);
  }

  async function viewAction(slug: string) {
    router.push(`/${slug}`);
  }

  async function editAction(_id: string) {
    router.push(`/dashboard/lists/edit/${_id}`);
  }

  async function addAction(_id: string) {
    router.push(`/dashboard/qandas/add/${_id}`);
  }
}
