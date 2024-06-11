import { isNull } from "@/app/utils/custom_helpers";
import { customSlugify } from "@/app/utils/custom_slugify";

export async function checkSinglePost(postData, url, update) {
  let response: any = { success: true };

  let slug = customSlugify(postData[0].slug);
  const res = await fetch(url, {
    next: {
      revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
    },
  });

  const result = await res.json();
  if (result.data !== "not_found" && update == false) {
    response = {
      success: false,
      msg: "post already exist, trying updating post instead",
      dataBody: postData[0],
      ids: [],
    };
  } else if (isNull(slug)) {
    response = {
      success: false,
      msg: "slug is required",
      dataBody: postData[0],
      ids: [],
    };
  }

  return response;
}
