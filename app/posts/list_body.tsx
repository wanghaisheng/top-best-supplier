import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { getS3Url } from "../lib/repo/files_repo";
import { extractDomain, isNull } from "../utils/custom_helpers";
import Lists from "./lists";
import Link from "next/link";
import {
  GlobeAltIcon,
  PhoneIcon,
  HomeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import RatingStars from "../components/widgets/rating_stars";
import GmapBodyView from "./gmap_body_views";

export default function ListBody({ post, reviews }) {
  if (isNull(post)) {
    return <>loading..</>;
  }

  const {
    _id,
    title,
    description,
    slug,
    extraClass,
    featuredImagePath,
    generatedImagePath,
    position,
    external_image,
    phone,
    website,
    all_images,
    subTitle,
    ratingScore,
    address,
    workday_timing,
    category,
    tags,
    type,
    is_english,
  } = post;

  let from_all_image: any = [];

  if (all_images) {
    from_all_image = all_images
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "'" && item !== "," && item !== "''");
  }

  const schedule = JSON.parse(workday_timing);
  const core_tags = JSON.parse(tags);

  const listSlug = "/" + slug;

  post.gmap_link = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBDBEybiy_vVEEIOZy5IuuhantILmGIhg0&center=${post.latitude},${post.longitude}&zoom=15&q=${post.latitude}%2C${post.longitude}`;

  return (
    <div className="relative flex sm:py-7">
      <div className="relative px-1 pb-2 pt-2 sm:mx-auto w-full sm:px-2">
        {post.type == "gmap_business" ? (
          <GmapBodyView post={post} topicData={post.topicData} isFull={true} />
        ) : (
          <></>
        )}

        {post.type == "no" ? (
          <article>
            <div className="container mx-auto px-4 py-8">
              <h3 id={`drop_reviews`} className="flex justify-start font-bold">
                Leave a review on {post.title} as {post.topicData.title}
              </h3>
              <div className="italic mb-5">
                this review and rating will have great impart on how we rank{" "}
                {post.title} on this platform
              </div>
              <form className="max-w-lg">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700">
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input mt-1 block w-full border border-red-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-gray-700">
                    Rating:
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    className="form-select mt-1 block w-full border border-red-500"
                  >
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="review" className="block text-gray-700">
                    Review:
                  </label>
                  <textarea
                    id="review"
                    name="review"
                    className="form-textarea mt-1 block w-full border border-red-500"
                  ></textarea>
                </div>
                <div className="text-center">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
            <h3
              id={`reviews`}
              className="flex justify-center m-5 p-5 font-bold"
            >
              {post.title} Reviews as {post.topicData.title}
            </h3>
            {reviews.result && Array.isArray(reviews.result) ? (
              reviews.result.map((r, i) => {
                let from_review_images: any = [];

                if (!isNull(r.user_photos)) {
                  const imageUrlArray = r.user_photos
                    .replace("{", "[")
                    .replace("}", "]");

                  from_review_images = JSON.parse(imageUrlArray);
                }
                return (
                  <div className="relative flex" key={i}>
                    <div className="relative w-full">
                      <div className="relative bg-white shadow-xl ring-1 ring-gray-900/5 mb-3 rounded">
                        <div className="bg-gray-200 flex justify-between items-center gap-x-3 px-2 py-1 text-xs font-bold text-left text-white rounded-tr rounded-tl">
                          <div className="flex flex-col justify-start items-start text-black">
                            {r.user_photo && (
                              <Image
                                unoptimized
                                src={r.user_photo}
                                width={50}
                                height={50}
                                alt={`${r.user_name}'s review on ${post.title} as ${post.topicData.title}`}
                                title={`${r.user_name}'s review on ${post.title} as ${post.topicData.title}`}
                              />
                            )}

                            {r.user_name}
                          </div>
                          <div className="flex flex-col justify-end items-end">
                            <RatingStars
                              ratingScore={parseFloat(post.ratingScore).toFixed(
                                1
                              )}
                            />
                          </div>
                        </div>
                        <div className="group relative pt-2 space-y-2 py-2 px-2 text-base text-gray-600">
                          <div className="text-sm leading-6 text-gray-600">
                            {r.review_text ? r.review_text : "no review"}
                          </div>
                          {from_review_images && (
                            <div className="flex flex-wrap">
                              {from_review_images.map((image, index) => (
                                <div key={index} className="m-2">
                                  <Image
                                    unoptimized
                                    src={image}
                                    alt={`${r.user_name}'s review on ${post.title} as ${post.topicData.title} index ${index}`}
                                    title={`${r.user_name}'s review on ${post.title} as ${post.topicData.title} index ${index}`}
                                    height={60}
                                    width={60}
                                    className="object-cover rounded"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end items-end text-xs italic p-1 border-t border-gray-200">
                          published at:{" "}
                          {r.published_at_date
                            ? new Date(r.published_at_date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long", // Full day of the week (e.g., Monday)
                                  year: "numeric", // Full year (e.g., 2022)
                                  month: "long", // Full month name (e.g., January)
                                  day: "numeric", // Day of the month (e.g., 1)
                                }
                              )
                            : "Invalid Date"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center"> no review yet </div>
            )}
          </article>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
