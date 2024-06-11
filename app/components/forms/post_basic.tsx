import { FileModel } from "@/app/models/file_model";
import React, { useState } from "react";
import FeaturedImage from "../widgets/featuredImage";
import TinyMCEEditor from "@/app/utils/tinymce";
import SelectSearch from "../widgets/select_search";
import { usePaginatedSWRAdmin } from "@/app/utils/fetcher";
import { isNull } from "@/app/utils/custom_helpers";
import SelectSearch2 from "../widgets/select_search2";
import { customSlugify } from "@/app/utils/custom_slugify";

export default function PostBasic({
  data,

  search,

  setSelectedParent = (e: any) => {},

  setTitle = (e: any) => {},

  setMetaTitle = (e: any) => {},

  setMetaDescription = (e: any) => {},

  setRankingScore = (e: any) => {},

  setRatingScore = (e: any) => {},

  setViews = (e: any) => {},

  setSlug = (e: any) => {},

  setDescription = (e: any) => {},

  setSelectedImage = (e: any) => {},
}) {
  const [page, setPage] = useState(1);
  const [customSlug, setCustomSlug] = useState(data.slug ?? "undefined");
  const perPage = 100;
  let [url, setUrl] = useState(search.selectSearchUrl);

  let searchData = [];
  // Slice topics array for current page
  const { paginatedData, loading } = usePaginatedSWRAdmin(url, page, perPage);

  if (paginatedData && paginatedData.length > 0) {
    searchData = paginatedData;
  }

  function handleSearch(value) {
    if (!isNull(value)) {
      setUrl(`${search.selectSearchUrl}&q=${value}`);
    } else {
      setUrl(url);
    }
  }

  function handleTitle(e) {
    setTitle(e.target.value);
    setCustomSlug(customSlugify(e.target.value));
    if (!data.update) {
      setSlug(customSlugify(e.target.value));
    }
  }

  return (
    <div>
      {search.showParentSearch && (
        <div className="mb-5">
          <SelectSearch
            label={search.label}
            data={searchData}
            onChange={(e) => handleSearch(e.target.value)}
            selected={search.selectedParent}
            setSelected={setSelectedParent}
            isDisabled={search.isDisabled ?? false}
          />
        </div>
      )}

      <div className="mb-5">
        <label
          className="block mb-2 uppercase font-bold text-xs text-gray-700"
          htmlFor="title"
        >
          Title
        </label>

        <input
          className="border border-gray-400 p-2 w-full rounded"
          type="text"
          id="title"
          name="title"
          defaultValue={data.title ?? ""}
          onChange={(e) => handleTitle(e)}
        />
      </div>

      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="meta-title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Meta Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="meta-title"
                  id="meta-title"
                  defaultValue={data.metaTitle ?? ""}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="slug"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Slug
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  value={data.slug ?? customSlug}
                  onChange={(e) => setSlug(e.target.value)}
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="meta-desc"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Meta Description
              </label>
              <div className="mt-2">
                <textarea
                  id="meta-desc"
                  name="meta-desc"
                  rows={2}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={data.metaDescription ?? ""}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                write seo friendly meta description
              </p>
            </div>
            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="views"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Views
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="views"
                  id="views"
                  defaultValue={data.views ?? ""}
                  onChange={(e) => setViews(e.target.value)}
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="score"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ranking Score
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="score"
                  id="score"
                  defaultValue={data.rankingScore ?? ""}
                  onChange={(e) => setRankingScore(e.target.value)}
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="rating-score"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rating Score
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="rating-score"
                  id="rating-score"
                  defaultValue={data.ratingScore ?? ""}
                  onChange={(e) => setRatingScore(e.target.value)}
                  autoComplete="rating-score"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeaturedImage
        selected={data.selectedImage ?? {}}
        setSelected={setSelectedImage}
        featuredImagePath={data.featuredImagePath ?? ""}
      />

      <div className="my-5">
        <label
          className="block mb-2 uppercase font-bold text-xs text-gray-700"
          htmlFor="body"
        >
          Body
        </label>

        <TinyMCEEditor
          onChange={(newValue) => setDescription(newValue)}
          initialValue={data.description ?? ""}
        />
      </div>
    </div>
  );
}
