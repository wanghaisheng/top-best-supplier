import Image from "next/image";
import { base_images_url, modifyImageUrl } from "../utils/custom_helpers";
import OptImage from "../utils/opt_image";

export default function image({
  post,
  title,
  topicData,
  h = 500,
  w = 200,
  twh = "h-48",
}) {
  const image = modifyImageUrl(post.processedImage);

  return (
    <>
      {post.processedImage && (
        <OptImage
          src={image}
          alt={`${title}: ${topicData.title}`}
          title={`${title}: ${topicData.title}`}
          //style={{ width: "100%", height: "100%" }}
          width={h}
          height={w}
          className={`${twh} w-full rounded-sm object-cover`}
          blurDataURL={base_images_url("beams-with.png")}
          placeholder="blur"
          loading="lazy"
        />
      )}
    </>
  );
}
