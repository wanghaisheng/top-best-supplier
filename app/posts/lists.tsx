import { LIST_IMAGE } from "@/constants";
import { base_url, checkImageValidity } from "../utils/custom_helpers";
import usePagination from "../utils/pagination";
import GmapBodyView from "./gmap_body_views";
import { listImage } from "../utils/list_image";

export default function Lists({ topicData }) {
  let perPage = 10;

  if (topicData.topData && topicData.topData.top) {
    perPage = topicData.topData.top;
  }

  const page = 1;
  let data = [];

  if (topicData.lists !== undefined && Array.isArray(topicData.lists.result)) {
    data = topicData.lists.result;
  }

  const paginatedData = usePagination(data, page, perPage);

  const topicSlug = topicData.slug;

  return (
    <ul>
      {paginatedData &&
        paginatedData.map((post, index) => {
          let from_all_image: any = [];

          if (post.all_images) {
            from_all_image = post.all_images
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== "'" && item !== "," && item !== "''");
          }

          post.from_all_image_1 = from_all_image[0];

          Promise.resolve(
            checkImageValidity(post.external_image).then((result) => {
              post.from_all_image_1 = result;
            })
          );

          Promise.resolve(
            checkImageValidity(post.external_image).then((result) => {
              post.external_image = result;
            })
          );

          post.processedImage = listImage(post);

          return (
            <li key={index} id={post.slug}>
              {post.type === "gmap_business" && (
                <GmapBodyView post={post} topicData={topicData} />
              )}
            </li>
          );
        })}
    </ul>
  );
}
