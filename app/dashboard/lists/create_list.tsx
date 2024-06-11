"use client";
import React, { useEffect, useState } from "react";
import { notFound, redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { postLists } from "@/app/lib/repo/lists_repo";
import { NEXT_PUBLIC_GET_TOPICS } from "@/constants";
import PostBasic from "@/app/components/forms/post_basic";
import { FileModel } from "@/app/models/file_model";
import { TopicModel } from "@/app/models/topic_model";
import { ListsModel } from "@/app/models/lists_model";
import { beforePost, byDemo, dataToast } from "@/app/utils/custom_helpers";
import { customSlugify } from "@/app/utils/custom_slugify";

export default function CreateList({ topicData }) {
  const router = useRouter();
  let [title, setTitle] = useState(byDemo);
  let [description, setDescription] = useState(byDemo);
  let [metaTitle, setMetaTitle] = useState(byDemo);
  let [metaDescription, setMetaDescription] = useState(byDemo);
  let [rankingScore, setRankingScore] = useState("");
  let [ratingScore, setRatingScore] = useState("");
  let [views, setViews] = useState("");
  let [slug, setSlug] = useState(customSlugify(byDemo()));
  let [featuredImagePath, setFeaturedImagePath] = useState("");
  let [selectedImage, setSelectedImage] = useState<FileModel>({});
  let [isUpdating, setIsUpdating] = useState(false);
  let [selectedParent, setSelectedParent] = useState<any>(topicData ?? {});
  const [page, setPage] = useState(1);
  const perPage = 5;

  let [selectSearchUrl, setselectSearchUrl] = useState(
    `${NEXT_PUBLIC_GET_TOPICS}?page=${"1"}&perPage=${"10"}`
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

    const topicId = data.selectedParent._id;
    const topic_slug = data.selectedParent.slug;
    const basicData: ListsModel = {
      title,
      metaTitle,
      metaDescription,
      rankingScore: parseInt(rankingScore),
      ratingScore,
      views,
      slug,
      description,
      featuredImagePath,
      topicId,
      topic_slug,
    };

    const requiredFields = {
      title,
      slug,
      metaTitle,
      topicId,
      topic_slug,
      metaDescription,
    };

    const errors = beforePost(requiredFields);

    if (errors !== true) {
      return errors;
    }

    const submitData = {
      _id: "",
      ...basicData,
    };

    try {
      const { success, msg } = await postLists([submitData], "no");

      dataToast(success, msg);

      if (success) {
        router.push("/dashboard/lists");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const search = {
    selectSearchUrl,
    showParentSearch: true,
    selectedParent,
    isDisabled: false,
    label: "Select Topic",
  };

  return (
    <div className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <p className="my-10">Topic: {title}</p>
        <form method="POST" className="px-1" onSubmit={handleSubmit}>
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
              Create List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
