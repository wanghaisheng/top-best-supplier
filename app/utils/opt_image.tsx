import Image from "next/image";

import {
  base_images_url,
  base_url,
  modifyImageUrl,
} from "../utils/custom_helpers";

export default function OptImage({
  src = "",
  alt = "",
  title = "",
  width = 50,
  height = 50,
  className = "",
  blurDataURL = "",
  placeholder = "",
  loading = "",
}) {
  //const image = base_url(`api/cdn?url=${src}`);

  return (
    <>
      <Image
        unoptimized
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        className={className}
      />
    </>
  );
}
