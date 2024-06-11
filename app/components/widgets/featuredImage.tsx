import React, { useState } from "react";
import Image from "next/image";
import { getS3Url } from "@/app/lib/repo/files_repo";
import { FileModel } from "@/app/models/file_model";
import MediaModal from "@/app/dashboard/media/media_modal";

export default function FeaturedImage({
  featuredImagePath,
  selected,
  setSelected,
}) {
  const [showImageModal, setShowImageModal] = useState(false);

  function handleSelected(v) {
    setSelected(v);
    setShowImageModal(false);
  }

  return (
    <div>
      <div className="col-span-full">
        <label
          htmlFor="photo"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Photo
        </label>
        <div className="mt-2 flex items-center gap-x-3 border border-dashed border-gray-900/25 rounded-xl">
          <div>
            <Image
              src={getS3Url(featuredImagePath)}
              alt={String(selected.title)}
              width={100}
              height={100}
              className="rounded-tl-xl rounded-bl-xl object-cover"
              priority={true}
            />
          </div>
          <button
            onClick={() => setShowImageModal(true)}
            type="button"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-5"
          >
            Change
          </button>
        </div>
      </div>
      {showImageModal && <MediaModal setSelected={handleSelected} />}
    </div>
  );
}
