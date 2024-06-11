import { TopicModel } from "@/app/models/topic_model";
import { customSlugify } from "@/app/utils/custom_slugify";
import { NEXT_PUBLIC_GET_REVIEWS } from "@/constants";
import { addReviews } from "../mongodb/query";
import { isNull, preFetch } from "@/app/utils/custom_helpers";
import { PostData } from "./post_data";

export async function postReviews(formData: any) {
  let postData: any,
    isImport: any,
    update: any,
    source: any,
    importTitle: any,
    business_id: any;

  try {
    const parsedData = JSON.parse(formData.get("postData"));
    postData = parsedData.postData;
    isImport = parsedData.isImport;
    update = parsedData.update;
    importTitle = parsedData.importTitle;
    business_id = parsedData.business_id;
  } catch (error) {
    const parsedData = formData; //already a json
    postData = parsedData.postData;
    isImport = parsedData.isImport;
    update = parsedData.update;
    source = parsedData.source;
    importTitle = parsedData.importTitle;
    business_id = parsedData.business_id;
  }

  try {
    const data: any[] = [];
    const updatedData: any[] = [];

    const promises = await postData.map(async (post, i) => {
      let id = post._id ? post._id : customSlugify(post.review_id_hash);

      const tData: any = {
        _id: post._id ? post._id : "",
        business_id: String(business_id),
        review_id_hash: post.review_id_hash,
        rating: post.rating,
        review_text: post.review_text,
        published_at: post.published_at,
        published_at_date: post.published_at_date,
        response_from_owner_text: post.response_from_owner_text,
        response_from_owner_ago: post.response_from_owner_ago,
        response_from_owner_date: post.response_from_owner_date,
        review_likes_count: post.review_likes_count,
        total_number_of_reviews_by_reviewer:
          post.total_number_of_reviews_by_reviewer,
        total_number_of_photos_by_reviewer:
          post.total_number_of_photos_by_reviewer,
        is_local_guide: post.is_local_guide,
        review_translated_text: post.review_translated_text,
        response_from_owner_translated_text:
          post.response_from_owner_translated_text,
      };

      const url = await preFetch(`${NEXT_PUBLIC_GET_REVIEWS}?id=${id}`);

      const result = await (await fetch(url)).json();

      if (isNull(id) == false) {
        if (result.data !== "not_found") {
          const formData = new FormData();
          tData._id = result.data._id;
          postData[i]._id = result.data._id;
          tData.isUpdated = false;
          tData.msg = "success";
          updatedData.push(tData);
        } else {
          tData.isUpdated = false;
          tData.msg = "success";
          data.push(tData);
          updatedData.push(tData);
        }
      } else {
        tData.isUpdated = false;
        tData.msg = "no id found";
        updatedData.push(tData);
      }
    });

    let res = {};

    try {
      await Promise.all(promises);

      res = await PostData(
        data,
        updatedData,
        () => addReviews(data),
        isImport,
        importTitle,
        "review"
      );
    } catch (e) {
      console.error("Error:", e);
      return {
        success: false,
        ids: [],
        msg: `${e}`,
        data: "",
        dataBody: "",
      };
    }

    return res;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      ids: [],
      msg: `${e}`,
      data: "",
      dataBody: "",
    };
  }
}
