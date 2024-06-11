"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_GET_FILES } from "@/constants";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { getS3Url } from "@/app/lib/repo/files_repo";
import { isNull } from "@/app/utils/custom_helpers";
import { FileModel } from "@/app/models/file_model";

function ImageTab({ setSelected, isDialog = false }) {
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<FileModel>({});
  const perPage = 10;
  const url = `${NEXT_PUBLIC_GET_FILES}?page=${page}&perPage=${perPage}`;

  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (paginatedData.length === 0) {
    return <div>no data</div>;
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedData.map((image) => (
          <div key={image._id}>
            <Image
              onClick={() => setActive(image)}
              src={getS3Url(`${image.path}/${image.slug}`)}
              alt={image.title}
              width={100}
              height={100}
              className="rounded-lg object-cover"
              priority={true}
            />
          </div>
        ))}
      </div>

      {active.title && isDialog && (
        <>
          <hr />
          <div className="flex items-center">
            <div className="px-2 py-4">selected: {active.slug}</div>
            <div className="ml-auto px-2 py-4">
              <button
                type="button"
                onClick={() => setSelected(active)}
                className="px-4 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                <span className="text-base leading-normal">insert</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function UploadTab() {
  const [file, setFile] = useState(null);
  const router = useRouter();

  function handleFileChange(e) {
    e.preventDefault();
    setFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3_uploader", {
        cache: "no-store",
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      router.refresh();
      toast.success(`${data.fileName} uploaded`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-5">
        <div className="text-center">
          <PaperClipIcon
            className="mx-auto h-8 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*, .csv, .pdf"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">CSV to 10MB</p>
        </div>
      </div>

      <div className="float-right px-2 py-4">
        <button
          disabled={!file}
          onClick={handleSubmit}
          className="flex justify-center px-4 py-1 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 mt-10"
        >
          <span className="text-base leading-normal">upload</span>
        </button>
      </div>
    </div>
  );
}

export default function Gallary({ isDialog, setSelected }) {
  const [tabIndex, setTabIndex] = useState(0);

  const tabs = [{ name: "Files" }, { name: "Upload" }];

  return (
    <div className="bg-white shadow-xl ring-1 ring-gray-900/5 h-2/4 mr-0 rounded mt-0">
      <Tab.Group onChange={(index) => setTabIndex(index)} vertical>
        <div className="flex">
          <div className="w-1/12 bg-gray-200">
            <Tab.List>
              {tabs.map((tab) => (
                <div className="border-t border-gray-300 p-1" key={tab.name}>
                  <Tab>{tab.name}</Tab>
                </div>
              ))}
            </Tab.List>
          </div>
          <div className="w-full px-4">
            <Tab.Panels>
              <div className="my-2">
                <Tab.Panel>
                  <ImageTab setSelected={setSelected} isDialog={isDialog} />
                </Tab.Panel>
              </div>
              <div className="my-2">
                <Tab.Panel>
                  <UploadTab />
                </Tab.Panel>
              </div>
            </Tab.Panels>
          </div>
        </div>
      </Tab.Group>
    </div>
  );
}
