"use client";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { postTopics, TopicModel } from "@/app/roadmap/topics_roadmap";
import { toast } from "sonner";
import { NEXT_PUBLIC_GET_TOPS } from "@/constants";
import {
  beforeImport,
  beforePost,
  byDemo,
  dataToast,
  isNull,
} from "@/app/utils/custom_helpers";
import { FileModel } from "@/app/models/file_model";
import PostBasic from "@/app/components/forms/post_basic";

import { customSlugify } from "@/app/utils/custom_slugify";

export default function CreateTopic({ topData }) {
  const router = useRouter();
  let [title, setTitle] = useState(byDemo);
  let [description, setDescription] = useState(byDemo);
  let [metaTitle, setMetaTitle] = useState(byDemo);
  let [metaDescription, setMetaDescription] = useState(byDemo);
  let [rankingScore, setRankingScore] = useState("0");
  let [ratingScore, setRatingScore] = useState("0");
  let [views, setViews] = useState("0");
  let [slug, setSlug] = useState(customSlugify(byDemo()));
  let [featuredImagePath, setFeaturedImagePath] = useState("");
  let [selectedImage, setSelectedImage] = useState<FileModel>({});
  let [isUpdating, setIsUpdating] = useState(false);
  let [selectedParent, setSelectedParent] = useState<TopicModel>({});
  let [page, setPage] = useState(1);
  let perPage = 5;

  let [selectSearchUrl, setselectSearchUrl] = useState(
    `${NEXT_PUBLIC_GET_TOPS}?page=${page}&perPage=${perPage}`
  );

  const data: any = {
    title,
    metaTitle,
    metaDescription,
    rankingScore,
    ratingScore,
    views,
    slug,
    description,
    featuredImagePath,
    update: false,
  };

  if (selectedImage.path) {
    data.featuredImagePath = `${selectedImage.path}/${selectedImage.slug}`;
    data.selectedImage = selectedImage;
    featuredImagePath = data.featuredImagePath;
  }

  if (selectedParent.title) {
    data.selectedParent = selectedParent;
    selectedParent = data.selectedParent;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const topId = selectedParent._id;
    const basicData: TopicModel = {
      title,
      metaTitle,
      metaDescription,
      rankingScore,
      ratingScore,
      views,
      slug,
      description,
      featuredImagePath,
      topId,
    };

    const requiredFields = { title, slug, metaTitle, topId, metaDescription };

    const errors = beforePost(requiredFields);

    if (errors !== true) {
      return errors;
    }

    const submitData = {
      _id: "",
      ...basicData,
    };

    try {
      const { success, msg } = await postTopics([submitData], "no");
      dataToast(success, msg);
      if (success) {
        router.push("/dashboard/topics");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const search = {
    selectSearchUrl,
    showParentSearch: true,
    selectedParent,
    isDisabled: false,
    label: "Select Top",
  };

  return (
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <p className="my-10">Topic: {title}</p>
        <form method="POST" className=" px-1" onSubmit={handleSubmit}>
          <PostBasic
            search={search}
            data={data}
            setTitle={setTitle}
            setMetaTitle={setMetaTitle}
            setMetaDescription={setMetaDescription}
            setRankingScore={setRankingScore}
            setRatingScore={setRatingScore}
            setViews={setViews}
            setSlug={setSlug}
            setDescription={setDescription}
            setSelectedImage={setSelectedImage}
            setSelectedParent={setSelectedParent}
          />

          <div className="flex justify-end">
            <button
              className="bg-blue-500 text-white px-2 py-2 rounded"
              type="submit"
            >
              Create Topic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
