import generateImportId from "@/app/lib/repo/import_repo";
import { TopicModel } from "@/app/models/topic_model";
import { customSlugify } from "@/app/utils/custom_slugify";
import {
  NEXT_PUBLIC_GET_QANDA,
  NEXT_PUBLIC_GET_TOPIC,
  NEXT_PUBLIC_POST_UPDATE_QANDA,
} from "@/constants";
import { addQandAs, addTopics } from "../mongodb/query";
import { isNull } from "@/app/utils/custom_helpers";
import { checkSinglePost } from "./check_single_post";
import { PostData } from "./post_data";
import { QandAModel } from "@/app/models/qanda_model";

export async function postQandaApi(formData: any) {
  try {
    const { postData, isImport, update } = JSON.parse(formData.get("postData"));
    const data: any[] = [];
    const updatedData: any[] = [];

    if (postData.length === 1) {
      const url = `${NEXT_PUBLIC_GET_QANDA}?id=${customSlugify(
        postData[0].slug
      )}`;
      const check = await checkSinglePost(postData, url, update);
      if (check.success == false) {
        return check;
      }
    }

    const promises = await postData.map(async (post, i) => {
      let postSlug = customSlugify(post.slug);
      let _id = post._id ? post._id : postSlug;

      const tData: QandAModel = {
        title: post.title,
        body: post.body,
        steps: post.steps,
        listId: post.listId,
        createdAt: new Date(),
        slug: postSlug,
      };

      const url = `${NEXT_PUBLIC_GET_QANDA}?id=${_id}`;
      const result = await (
        await fetch(url, {
          next: {
            revalidate: parseInt(
              process.env.NEXT_PUBLIC_RE_VALIDATE as string,
              10
            ),
          },
        })
      ).json();

      if (isNull(postSlug) == false) {
        if (result.data !== "not_found") {
          const formData = new FormData();
          tData._id = result.data._id;
          formData.append("updateData", JSON.stringify(tData));
          const url = `${NEXT_PUBLIC_POST_UPDATE_QANDA}`;
          const response = await (
            await fetch(url, {
              cache: "no-store",
              method: "POST",
              body: formData,
            })
          ).json();

          response;
          tData.isUpdated = true;
          tData.msg = "success";
          updatedData.push(tData);
        } else {
          tData.isUpdated = false;
          tData.body = JSON.stringify(tData.body);
          tData.msg = "success";
          data.push(tData);
          updatedData.push(tData);
        }
      } else {
        tData.isUpdated = false;
        tData.msg = "no slug found";
        updatedData.push(tData);
      }
    });

    let res = {};

    try {
      await Promise.all(promises);
      res = await PostData(data, updatedData, () => addQandAs(data), isImport);
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
    console.log(e);
    return {
      success: false,
      ids: [],
      msg: `${e}`,
      data: "",
      dataBody: "",
    };
  }
}
