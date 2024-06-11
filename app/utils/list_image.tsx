import { getS3Url, uploadToS3FromUrl } from "../lib/repo/files_repo";
import { UpdateList, postLists } from "../lib/repo/lists_repo";
import {
  base_images_url,
  base_url,
  checkImageValidity,
  isNull,
  modifyImageUrl,
} from "./custom_helpers";

export function listImage(data: any): string {
  const featuredImagePath = data.featuredImagePath;
  const generatedImagePath = data.generatedImagePath;
  const slug = data.slug;

  if (!isNull(featuredImagePath)) {
    return getS3Url(featuredImagePath);
  } else if (!isNull(generatedImagePath)) {
    return getS3Url(generatedImagePath);
  } else if (!isNull(data.external_image)) {
    return data.external_image;
  } else {
    try {
      fetch(base_url(`/api/actions?tag=${data._id}`));
      return base_images_url("placeholder.png");
    } catch (e) {
      console.error("Error uploading image to S3:", e);
      return base_images_url("placeholder.png");
    }
  }
}

export const list_image_array = (data, max = 6, w = 500, h = 500) => {
  let lists: any[] = [];

  if (!isNull(data.external_image)) {
    lists.push(modifyImageUrl(data.external_image, w, h));
  }

  if (!isNull(data.all_images)) {
    const jsonData = "[" + data.all_images.slice(1, -1) + "]";
    const urlsArray = JSON.parse(jsonData);
    let list_n = 0;
    for (let i = 0; i < urlsArray.length; i++) {
      if (list_n <= 6) {
        lists.push(modifyImageUrl(urlsArray[i], w, h));
        list_n++;
      }
    }
  }
  return lists;
};
