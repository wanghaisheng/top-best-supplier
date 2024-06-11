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
import { DASH_TOPICS, NEXT_PUBLIC_GET_QANDAS } from "@/constants";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { notFound, useRouter } from "next/navigation";
import ConfirmAction from "@/app/components/widgets/confirm";
import { toast } from "sonner";
import { ActionButtons } from "@/app/components/widgets/action_buttons";
import { removeById } from "@/app/utils/custom_helpers";
import Shimmer from "@/app/components/shimmer";
import DataTable from "@/app/components/widgets/data_table";
import { deleteQandA } from "@/app/lib/repo/qanda_repo";

export const dynamic = "force-dynamic";

export default function QandAView({ listId }) {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  let [data, setData] = useState(Shimmer(5));
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const perPage = 10;
  const url = `${NEXT_PUBLIC_GET_QANDAS}?page=${page}&perPage=${perPage}&listId=${listId}`;

  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (loading || !Array.isArray(paginatedData)) {
    return <Loading />;
  }

  if (updating === false) {
    data = paginatedData;
  }
  console.log(url);
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
        addText={"ans & steps"}
      />
    </>
  );

  async function deleteAction(_id: string) {
    setUpdating(true);
    const updatedImports = removeById(data, _id);
    setData(updatedImports);

    const res = await deleteQandA(_id);
    if (res.data.success) {
      toast.success(`item deleted`);
    } else {
      toast.error(`items not deleted`);
    }
  }
  async function viewAction(slug: string) {
    router.push(`/${slug}`);
  }

  async function editAction(_id: string) {
    router.push(`/dashboard/qandas/edit/${_id}`);
  }

  async function addAction(_id: string) {
    router.push(`/dashboard/qandas/stepsandans/${_id}`);
  }
}
