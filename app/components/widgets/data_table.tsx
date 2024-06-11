"use client";
import React, { useEffect, useState } from "react";
import Pagination from "rc-pagination";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import { ActionButtons } from "@/app/components/widgets/action_buttons";
import { useRouter } from "next/navigation";
import { isNull } from "@/app/utils/custom_helpers";

export default function DataTable({
  data,
  deleteAction,
  viewAction,
  editAction,
  addAction,
  setPage,
  perPage,
  total = 10,
  page,
  addText,
}) {
  const router = useRouter();

  if (isNull(data)) {
    return <div>No result found</div>;
  }

  return (
    <>
      <table className="w-full whitespace-nowrap">
        <tbody>
          {data.map(({ title, _id, slug }) => (
            <tr key={_id} className="text-sm leading-none text-gray-600 h-16">
              <td className="w-1/2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-sm flex items-center justify-center">
                    <p className="text-xs font-bold leading-3 text-white">
                      {"#"}
                    </p>
                  </div>
                  <div className="pl-2">
                    <p className="text-sm font-medium leading-none text-gray-800">
                      {title}
                    </p>
                    <p className="text-xs leading-3 text-gray-600 mt-2">
                      added by admin
                    </p>
                  </div>
                </div>
              </td>

              <td className="pl-16">
                <button
                  onClick={() => addAction(_id)}
                  className="flex items-center text-green-600"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="ml-1">{addText}</span>
                </button>
              </td>
              <td>
                <div className="pl-16">
                  <ActionButtons
                    headerText="Delete Item"
                    info={`Are you sure you want to delete <b>${title}</b>? <br/><br/> Note this will also delete the questions and can not be reversed`}
                    id={_id}
                    onDelete={() => deleteAction(_id)}
                    onView={() => viewAction(slug)}
                    onEdit={() => editAction(_id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        className="pagination"
        current={page} // use current instead of page
        onChange={setPage}
        total={total}
        pageSize={perPage}
        showPrevNextJumpers={true}
        prevIcon={"«"}
        nextIcon={"»"}
        showTitle={false}
        hideOnSinglePage={true}
        showLessItems={true}
      />
    </>
  );
}
