import { getS3Url, uploadToS3FromUrl } from "../lib/repo/files_repo";
import { postTopics } from "../roadmap/topics_roadmap";
import {
  base_images_url,
  base_url,
  checkImageValidity,
  isNull,
} from "./custom_helpers";
import { list_image_array } from "./list_image";

export function topicImage(data: any): string {
  const slug = data.slug;

  if (!isNull(data.featuredImagePath)) {
    return getS3Url(data.featuredImagePath);
  } else if (!isNull(data.generatedImagePath)) {
    return getS3Url(data.generatedImagePath);
  } else if (!isNull(data.external_image)) {
    return data.external_image;
  } else {
    try {
      fetch(base_url(`/api/actions?tag=${data._id}`));
      const image = list_image_array(data.lists.result[0], 300, 300);
      if (!isNull(image[0])) {
        return image[0];
      }

      return base_images_url("placeholder.png");
    } catch (e) {
      console.error("Error uploading topic image to S3:", e);
      return base_images_url("placeholder.png");
    }
  }
}
