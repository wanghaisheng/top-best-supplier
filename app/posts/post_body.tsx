import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { getS3Url } from "../lib/repo/files_repo";
import { TOPIC_IMAGE } from "@/constants";
import {
  base_images_url,
  base_url,
  checkImageValidity,
  isNull,
} from "../utils/custom_helpers";
import { topicImage } from "../utils/topic_image";
import dynamic from "next/dynamic";

const LazyImage = dynamic(() => import("./lazy_image"), {
  loading: () => <p>Loading...</p>,
});

export default function PostBody({ post }) {
  const {
    _id,
    title,
    description,
    featuredImagePath,
    generatedImagePath,
    slug,
    extraClass,
    external_image,
  } = post;

  return (
    <div className={`bg-white px-2 py-2 my-5 rounded-sm`}>
      {!isNull(post.processedImage) && (
        <LazyImage
          post={post}
          topicData={post}
          title={title}
          h={400}
          w={500}
          twh="w-full"
        />
      )}

      <div className="mb-8">
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(description),
          }}
        />
      </div>
    </div>
  );
}
