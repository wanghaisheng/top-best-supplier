"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../loading";
import { deleteImports } from "@/app/lib/repo/import_repo";
import DataTable from "@/app/components/widgets/data_table";
import { NEXT_PUBLIC_GET_IMPORTS } from "@/constants";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { dataToast, removeById } from "@/app/utils/custom_helpers";

export default function ImportsView() {
  const [page, setPage] = useState(1);
  let [data, setData] = useState([]);
  const perPage = 10;
  const [updating, setUpdating] = useState(false);

  const url = `${NEXT_PUBLIC_GET_IMPORTS}?page=${page}&perPage=${perPage}`;

  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (updating === false) {
    data = paginatedData;
  }

  if (loading) {
    return <Loading />;
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
        addText={"items"}
      />
    </>
  );

  async function deleteAction(_id: string) {
    setUpdating(true);
    const updatedImports = removeById(data, _id);
    setData(updatedImports);

    const { success, msg } = await deleteImports(_id);
    dataToast(success, msg);
  }

  async function viewAction(slug: string) {}

  async function editAction(_id: string) {}

  async function addAction(_id: string) {}
}
