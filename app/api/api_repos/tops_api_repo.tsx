import generateImportId from "@/app/lib/repo/import_repo";
import { customSlugify } from "@/app/utils/custom_slugify";
import { NEXT_PUBLIC_GET_TOP, NEXT_PUBLIC_UPDATE_TOP } from "@/constants";
import { addTops } from "../mongodb/query";
import { isNull } from "@/app/utils/custom_helpers";
import { TopModel } from "@/app/models/top_model";
import { PostData } from "./post_data";

export async function postTops(formData: any) {
  try {
    const { postData, isImport, update } = JSON.parse(formData.get("postData"));
    const data: any[] = [];
    const updatedData: any[] = [];

    if (postData.length === 1) {
      let slug = customSlugify(postData[0].slug);
      const url = `${NEXT_PUBLIC_GET_TOP}?id=${slug}`;
      const res = await fetch(url, {
        next: {
          revalidate: parseInt(
            process.env.NEXT_PUBLIC_RE_VALIDATE as string,
            10
          ),
        },
      });

      const result = await res.json();
      if (result.data !== "not_found" && update == false) {
        return {
          success: false,
          msg: "post already exist, trying updating post instead",
          dataBody: postData[0],
          ids: [],
        };
      } else if (isNull(slug)) {
        return {
          success: false,
          msg: "slug is required",
          dataBody: postData[0],
          ids: [],
        };
      }
    }

    const promises = await postData.map(async (post, i) => {
      let postSlug = customSlugify(post.slug);
      let _id = post._id ? post._id : postSlug;

      const tData: TopModel = {
        title: post.title,
        top: post.top,
        description: post.description,
        body: post.body,
        createdAt: new Date(),
        updatedAt: post.updatedAt,
        status: post.status,
        subTitle: post.subTitle,
        slug: postSlug,
        image: post.image,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        importId: post.importId,
      };

      const url = `${NEXT_PUBLIC_GET_TOP}?id=${_id}`;
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

      if (result.data !== "not_found") {
        const formData = new FormData();
        tData._id = result.data._id;
        formData.append("updateData", JSON.stringify(tData));
        const url = `${NEXT_PUBLIC_UPDATE_TOP}`;
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
        tData.msg = "success";
        data.push(tData);
        updatedData.push(tData);
      }
    });

    let res = {};

    try {
      await Promise.all(promises);
      res = await PostData(data, updatedData, () => addTops(data), isImport);
    } catch (e) {
      console.error("top Error:", e);
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
