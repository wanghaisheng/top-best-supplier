import {
  ClockIcon,
  GlobeAltIcon,
  HomeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import RatingStars from "../components/widgets/rating_stars";
import {
  base_images_url,
  base_url,
  checkImageValidity,
  extractDomain,
  isNull,
} from "../utils/custom_helpers";
import { getS3Url } from "../lib/repo/files_repo";
import { LIST_IMAGE, PPC } from "@/constants";
import { listImage } from "../utils/list_image";
import dynamic from "next/dynamic";
import MapModel from "./map_model";

const LazyIframe = dynamic(() => import("./iframe"), {
  loading: () => <p>Loading...</p>,
});

const LazyImage = dynamic(() => import("./lazy_image"), {
  loading: () => <p>Loading...</p>,
});

const amenityIcons = {
  Lunch: "\u{1F372}",
  Dinner: "\u{1F37D}",
  "Solo dining": "\u{1F468}",
  "Wheelchair-accessible car park": "\u{1F3E8}",
  "Wheelchair-accessible entrance": "\u{267F}",
  "Wheelchair-accessible seating": "\u{267D}",
  "Wheelchair-accessible toilet": "\u{1F6BB}",
  Alcohol: "\u{1F378}",
  Beer: "\u{1F37A}",
  Coffee: "\u{2615}",
  "Comfort food": "\u{1F35E}",
  "Organic dishes": "\u{1F331}",
  "Quick bite": "\u{1F956}",
  "Small plates": "\u{1F37D}",
  Breakfast: "\u{1F375}",
  Brunch: "\u{1F305}",
  Catering: "\u{1F69B}",
  Dessert: "\u{1F370}",
  Seating: "\u{1FA91}",
  Toilets: "\u{1F6BD}",
  Casual: "\u{1F4F5}",
  "Family friendly": "\u{1F9D1}",
  Groups: "\u{1F465}",
  "Accepts reservations": "\u{1F4C5}",
  "Credit cards": "\u{1F4B3}",
  "Debit cards": "\u{1F4B3}",
  "Good for kids": "\u{1F9D2}",
  "High chairs": "\u{1FA91}",
  "Kids' menu": "\u{1F370}",
  "Free parking lot": "\u{1F17F}",
  "Offers Takeout": "\u{1F961}",
  "No Reservations": "\u{1F6AB}",
  "Accepts Credit Cards": "\u{1F4B3}",
  "Casual, Classy": "\u{1F973}\u{1F60E}",
  Loud: "\u{1F50A}",
  "Good for Groups": "\u{1F465}",
  "Good for Dinner": "\u{1F37D}",
  "Pool Table": "\u{1F3B1}",
  "Private Lot Parking": "\u{1F17F}",
  "Free Wi-Fi": "\u{1F4F6}",
  "Happy Hour Specials": "\u{1F378}\u{1F4F5}",
  "Full Bar": "\u{1F37B}",
  TV: "\u{1F4FA}",
  "No Outdoor Seating": "\u{1F6D1}",
  "Offers Catering": "\u{1F69B}",
  "Not Good For Kids": "\u{1F6AB}",
  "Bike Parking": "\u{1F6B2}",
};

export default function GmapBodyView({ post, topicData, isFull = false }) {
  try {
    if (isNull(post) || isNull(topicData)) {
      return <div>loading..</div>;
    }

    let {
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
      from_all_image_1,
    } = post;

    let amenities: any = post.amenities;

    const imgUrl = `${LIST_IMAGE}/${slug}`;

    let schedule: any = [];
    if (workday_timing) {
      schedule = JSON.parse(workday_timing);
    }

    let core_tags: any = [];
    if (tags) {
      core_tags = JSON.parse(tags);
    }

    const listSlug = topicData.slug + "/" + slug;

    const default_work_day: any = [
      ["Monday", 1, [2024, 3, 11], [["24 hours", [[7], [21]]]], 0, 1],
      ["Tuesday", 2, [2024, 3, 12], [["24 hours", [[7], [21]]]], 0, 1],
      ["Wednesday", 3, [2024, 3, 6], [["24 hours", [[7], [21]]]], 0, 1],
      ["Thursday", 4, [2024, 3, 7], [["24 hours", [[7], [21]]]], 0, 1],
      ["Friday", 5, [2024, 3, 8], [["24 hours", [[7], [21]]]], 0, 1],
      ["Saturday", 6, [2024, 3, 9], [["24 hours", [[7], [21]]]], 0, 1],
      ["Sunday", 7, [2024, 3, 10], [["24 hours", [[7], [21]]]], 0, 1],
    ];

    return (
      <article className="relative bg-white w-full shadow-xl ring-1 ring-gray-900/5 text-gray-900 mb-10 rounded">
        <div
          className={`${extraClass} bg-gray-100 text-black border-b border-gray-300`}
        >
          <div className="flex justify-between h-14">
            {isFull ? (
              <Link
                rel="follow"
                className="text-red-600"
                href={String(base_url(`${topicData.slug}#${slug}`))}
              >
                <div className="flex flex-col w-[100%]">
                  <div className="flex pl-3 font-bold">
                    <div className="flex">
                      No. {position} in {topicData.title}
                    </div>
                  </div>
                  {!isNull(ratingScore) && ratingScore == "no" ? (
                    <div className="flex pl-3 ml-10">
                      <RatingStars ratingScore={ratingScore} />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex flex-col w-[100%]">
                <div className="flex pl-3 font-bold">
                  <div className="flex">
                    Top {position}: {title}
                  </div>
                </div>
                {!isNull(ratingScore) && ratingScore == "no" ? (
                  <div className="flex pl-3 ml-10">
                    <RatingStars ratingScore={ratingScore} />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            )}

            {!isFull && (
              <div className="flex flex-col bg-red-600 text-white w-44 rounded-tr">
                <a
                  rel="nofollow"
                  target="_blank"
                  href={`${PPC}?url=${
                    website ? website : base_url(`${topicData.slug}/${slug}`)
                  }&utm_campaign=${topicData.slug}`}
                >
                  <div className="flex items-center justify-between h-12 p-1">
                    <div className="flex items-center">
                      <span className="mr-0">visit website</span>
                    </div>
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-5 w-5" />
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="lg:flex lg:justify-between border-b border-gray-300">
          <div className="lg:flex lg:flex-col bg-red-200 w-full lg:w-[50%]">
            <div className="flex">
              <LazyImage post={post} topicData={topicData} title={title} />
            </div>
          </div>
          <div className="lg:flex lg:flex-col w-full lg:w-[50%]">
            {isFull ? (
              /*<LazyIframe post={post} /> */

              <MapModel post={post} />
            ) : (
              <div className="p-2">
                <Link href={listSlug}>
                  <h2 className="flex font-bold pb-2">{subTitle}</h2>{" "}
                </Link>

                <div className="flex">
                  {title} is the number {position} in the list of{" "}
                  {topicData.title}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:flex lg:flex-grow lg:justify-between border-b border-gray-300">
          <div className="flex flex-col lg:flex-grow w-full lg:w-[40%] lg:border-r border-gray-300 p-2">
            {!isNull(post.phone) && (
              <div className="flex items-center border-b border-gray-100 text-sm p-1">
                <PhoneIcon className="h-4 w-4 mr-2" /> {phone}
              </div>
            )}
            {!isNull(address) && (
              <div className="flex items-center border-b border-gray-100 text-xs p-1">
                <HomeIcon className="h-5 w-5 mr-2" /> {address}
              </div>
            )}
            {!isNull(post.website) && (
              <div className="flex items-center border-b border-gray-100 text-xs p-1">
                <GlobeAltIcon className="h-5 w-5 mr-2" />{" "}
                {extractDomain(post.website)}
              </div>
            )}

            {!isNull(post.time_zone) && (
              <div className="flex items-center border-b border-gray-100 text-xs p-1">
                <ClockIcon className="h-5 w-5 mr-2" /> {post.time_zone}
              </div>
            )}
          </div>

          <div className="lg:flex lg:flex-grow lg:flex-col w-full lg:w-[60%]">
            <div className="flex justify-between">
              <div className="flex flex-col w-[50%] border-r p-2">
                <div className="text-md">
                  <u>Core Services & Tags:</u>

                  {topicData && topicData.category && (
                    <div className="flex items-center">
                      <div className="bg-red-500 w-1 h-1 mr-2 text-sm"></div>
                      <div className="text-sm">{topicData.category}</div>
                    </div>
                  )}
                  {core_tags &&
                    core_tags.map((c, index) => (
                      <div className="flex items-center" key={index}>
                        <div className="bg-red-500 w-1 h-1 mr-2 text-sm"></div>
                        <div className="text-sm">{c}</div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-grow w-[50%]  p-2">
                <div className="text-md justify-center items-center">
                  <u>Services Hours:</u>
                  {schedule && Array.isArray(schedule)
                    ? schedule.map((entry, index) => (
                        <div className="flex items-center" key={index}>
                          <div className="bg-red-500 w-1 h-1 mr-2 text-sm"></div>
                          <div className="text-[12px]" key={index}>
                            <strong> {entry[0]}</strong>:
                            {entry[3] &&
                              entry[3].map((timing, timingIndex) => (
                                <span className="pl-3" key={timingIndex}>
                                  {timing[0]}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))
                    : Array.isArray(default_work_day) &&
                      default_work_day.map((entry, index) => (
                        <div className="flex items-center" key={index}>
                          <div className="bg-red-500 w-1 h-1 mr-2 text-sm"></div>
                          <div className="text-[12px]" key={index}>
                            <strong> {entry[0]}</strong>:
                            {entry[3] &&
                              entry[3].map((timing, timingIndex) => (
                                <span className="pl-3" key={timingIndex}>
                                  {timing[0]}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isFull && !isNull(amenities) && (
          <div className="grid grid-cols-2 gap-4 m-5">
            {amenities.map((item, i) => {
              const iconName = amenityIcons[item["key"]];
              let displayIcon = iconName ? iconName : "\u2714"; // Default to a checkmark icon if iconName doesn't exist
              let iconClasses = "text-green-500";

              // Check for specific words in amenity and change icon accordingly
              if (
                item["amenity"].toLowerCase().includes("no") ||
                item["amenity"].toLowerCase().includes("doesn't") ||
                item["amenity"].toLowerCase().includes("not")
              ) {
                displayIcon = "\u2716"; // Change to 'X' icon for negative descriptions
                iconClasses = "text-red-500";
              }

              return (
                <div key={i} className="flex">
                  <span className={iconClasses}>{displayIcon}</span>
                  <span className="ml-1">{item["amenity"]}</span>
                </div>
              );
            })}
          </div>
        )}

        {is_english == "en" ? <div className="p-2">{description}</div> : <></>}

        {!isFull ? (
          <div className="flex justify-end items-end">
            <Link rel="nofollow" className="text-red-600" href={listSlug}>
              <div className="pt-2 items-end mr-3 h-10 text-sm">
                see details
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex justify-end items-end  border-t border-gray-300">
            <div className="flex flex-col bg-red-600 text-white w-44 rounded-br">
              <a
                rel="nofollow"
                target="_blank"
                href={`${PPC}?url=${
                  website ? website : base_url(`${topicData.slug}/${slug}`)
                }&utm_campaign=${topicData.slug}`}
              >
                <div className="flex items-center justify-between h-12 p-1">
                  <div className="flex items-center">
                    <span className="mr-0">visit website</span>
                  </div>
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </article>
    );
  } catch (e) {
    console.error(e);
    return <div>loading..</div>;
  }
}
