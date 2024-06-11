"use client";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_GET_TOPS } from "@/constants";
import { useState } from "react";
import Shimmer from "@/app/components/shimmer";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { toast } from "sonner";
import DataTable from "@/app/components/widgets/data_table";
import TopsImport from "@/app/dashboard/tops/tops_import";
import TemplateBody from "../templates/body";
import TabbedContents from "@/app/components/widgets/tabbed_contents";
import { deleteTop } from "@/app/lib/repo/tops_repo";
import { removeById } from "@/app/utils/custom_helpers";

export default function Index() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [updating, setUpdating] = useState(false);
  const perPage = 5;
  let [data, setData] = useState([]);
  let [url, setUrl] = useState(
    `${NEXT_PUBLIC_GET_TOPS}?page=${page}&perPage=${perPage}`
  );

  const { paginatedData, raw_data, loading } = usePaginatedSWRAdmin(
    url,
    page,
    perPage
  );

  if (paginatedData && paginatedData.length > 0 && updating == false) {
    data = paginatedData;
  }

  const tabComponents = [
    {
      id: 1,
      status: "active",
      title: "Tops",
      component: (
        <DataTable
          data={data}
          page={page}
          total={20}
          perPage={perPage}
          deleteAction={deleteAction}
          setPage={() => setPage}
          viewAction={viewAction}
          editAction={editAction}
          addAction={addAction}
          addText={"topics"}
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
      title: "import tops",
      component: <TopsImport />,
    },
  ];

  return (
    <>
      <TabbedContents title={"Tops"} tabComponents={tabComponents} />
    </>
  );

  async function deleteAction(_id: string) {
    setUpdating(true);
    const updatedImports = removeById(data, _id);
    setData(updatedImports);

    const res = await deleteTop(_id);

    if (res.data.success) {
      toast.success("Items deleted successfully");
    } else {
      toast.error("Error deleteing Items");
    }
  }

  async function viewAction(slug: string) {
    toast.warning("no view yet");
  }

  async function editAction(_id: string) {
    toast.warning("no edit yet");
  }

  async function addAction(_id: string) {
    router.push(`/dashboard/tops/add/${_id}`);
  }
}
