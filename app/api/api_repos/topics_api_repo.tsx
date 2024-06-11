import generateImportId from "@/app/lib/repo/import_repo";
import { TopicModel } from "@/app/models/topic_model";
import { customSlugify } from "@/app/utils/custom_slugify";
import {
  NEXT_PUBLIC_GET_TOPIC,
  NEXT_PUBLIC_UPDATE_LIST,
  NEXT_PUBLIC_UPDATE_TOPIC,
} from "@/constants";
import { addTopics } from "../mongodb/query";
import {
  base_url,
  beforeInsert,
  isNull,
  preFetch,
} from "@/app/utils/custom_helpers";
import { checkSinglePost } from "./check_single_post";
import { PostData } from "./post_data";
import { getTops } from "@/app/lib/repo/tops_repo";
import { ListsModel } from "@/app/models/lists_model";
import { ObjectId } from "mongodb";
import { postListsApi, ListProcessImage } from "./lists_api_repo";
import { uploadToS3FromUrl } from "@/app/lib/repo/files_repo";
import { updateTopicApi } from "../post/[action]/route";

export async function postTopics(formData: any) {
  let postData: any, isImport: any, update: any, source: any, importTitle: any;

  try {
    const parsedData = JSON.parse(formData.get("postData"));
    postData = parsedData.postData;
    isImport = parsedData.isImport;
    update = parsedData.update;
    importTitle = parsedData.importTitle;
  } catch (error) {
    const parsedData = formData; //already a json
    postData = parsedData.postData;
    isImport = parsedData.isImport;
    update = parsedData.update;
    source = parsedData.source;
    importTitle = parsedData.importTitle;
  }

  try {
    const data: any = [];
    const updatedData: any = [];

    if (source && source == "gmap") {
      const check = await processGMapData(postData, update);
      if (check.success == false) {
        return check;
      } else {
        postData = check.gData;
      }
    } else if (postData.length === 1) {
      const url = `${NEXT_PUBLIC_GET_TOPIC}?topicId=${postData[0].slug}`;
      const check = await checkSinglePost(postData, url, update);
      if (check.success == false) {
        return check;
      }
    }

    const promises = await postData.map(async (post, i) => {
      let postSlug = customSlugify(post.slug);

      let id = post._id ? post._id : postSlug;

      if (source == "gmap") {
        id = postSlug;
      }

      const tData: TopicModel = {
        title: post.title,
        description: post.description,
        body: post.body,
        createdAt: new Date(),
        updatedAt: post.updatedAt,
        topId: post.topId,
        status: post.status,
        subTitle: post.subTitle,
        type: post.type,
        slug: postSlug,
        catId: post.catId,
        image: post.image,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        importId: post.importId,
        featuredImagePath: post.featuredImagePath,
        rankingScore: post.rankingScore,
        ratingScore: post.ratingScore,
        views: post.views,
        selectedImage: post.selectedImage,
        generatedImagePath: post.generatedImagePath,
        newly_updated: post.newly_updated,
      };

      const url = await preFetch(`${NEXT_PUBLIC_GET_TOPIC}?topicId=${id}`);
      const result = await (await fetch(url)).json();

      if (isNull(postSlug) == false) {
        if (result.data !== "not_found") {
          const formData = new FormData();
          tData._id = result.data._id;
          postData[i]._id = result.data._id;
          formData.append("updateData", JSON.stringify(tData));
          const url = `${NEXT_PUBLIC_UPDATE_TOPIC}`;
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
          const _id = new ObjectId();
          tData._id = _id;
          postData[i]._id = _id;
          data.push(tData);
          updatedData.push(tData);
        }
      } else {
        tData.isUpdated = false;
        tData.msg = "no slug found";
        const _id = new ObjectId();
        tData._id = _id;
        updatedData.push(tData);
      }
    });

    let res = {};

    try {
      await Promise.all(promises);

      res = await PostData(
        data,
        updatedData,
        () => addTopics(data),
        isImport,
        importTitle,
        "topic"
      );

      for (let i = 0; i < postData.length; i++) {
        if (postData[i].lists && Array.isArray(postData[i].lists)) {
          for (let li = 0; li < postData[i].lists.length; li++) {
            postData[i].lists[li].topicId = String(postData[i]._id);
          }

          let lData = {
            postData: postData[i].lists,
            source: source,
            update: update,
            isImport: isImport,
          };

          await postListsApi(lData);
        }

        await generateListPositions(postData[i]._id);
      }
    } catch (e) {
      console.error("Error 7eytdggd:", e);
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
    console.error(`Topics Post: ${e.stack || e}`);
    return {
      success: false,
      ids: [],
      msg: `${e}`,
      data: "",
      dataBody: "",
    };
  }
}

export async function processGMapData(postData, update) {
  try {
    const data: any = [];
    for (let i = 0; i < postData.length; i++) {
      const gData = postData[i];
      const nearestTop: any = await findNearestTop(gData.lists.length);
      const listsData: any = [];

      for (let i = 0; i < gData.lists.length; i++) {
        const gList = gData.lists[i];

        const pattern = /([^>:|-]+)\s*(?:>|\:|\-|\||\,|$)/;

        // Use the exec method to match the pattern in the input string
        const match = pattern.exec(gList.name);

        // Extract the matched words (if any)
        const gTitle = match ? match[1] : gList.name;

        const mRate = parseInt(gList.rating) * 10;
        const lData: ListsModel = {
          title: String(gTitle).trim(),
          subTitle: gList.name.trim(),
          description: gList.about,
          body: gList.about,
          slug: gList.name,
          rankingScore: parseInt(String(mRate + parseInt(gList.reviews))),
          ratingScore: gList.rating,
          gmap_link: gList.link,
          type: "gmap_business",
          address: gList.address,
          category: gList.main_category,
          tags: JSON.stringify(gList.categories),
          phone: gList.phone,
          website: gList.website,
          place_id: gList.place_id,
          location_country: gList.country,
          location_state: gList.location_state,
          location_city: gList.location_city,
          external_image: gList.featured_image,
          all_images: gList.all_images,
          detailed_reviews: gList.detailed_reviews,
          workday_timing: JSON.stringify(gList.workday_timing),
          time_zone: gList.time_zone,
          location: gList.location,
          latitude: gList.latitude,
          Longitude: gList.Longitude,
          lang_long: gList.lang_long,
          lang_short: gList.lang_short,
          icon: gList.icon,
          status: "published",
        };

        listsData.push(lData);
      }

      const basicData: TopicModel = {
        title: `Top {top} Best ${gData.title} in {year}`,
        metaTitle: `Best: Top {top} ${gData.title}`,
        metaDescription: `Welcome to the best {top} ${gData.title}. This is top {top} ${gData.title} currently`,
        rankingScore: "",
        ratingScore: "",
        views: "",
        slug: gData.title,
        description: `This is bussiness the list of the top {top} ${gData.title}`,
        featuredImagePath: "",
        topId: nearestTop._id ?? "",
        type: "gmap_business",
        status: "published",
        lists: listsData,
      };

      data.push(basicData);
    }
    return { success: true, gData: data };
  } catch (error) {
    return { success: false, gData: {} };
  }
}

async function findNearestTop(length) {
  if (length < 5) {
    length = 5;
  }
  const tops = await getTops();

  const nearestItem = tops.result.reduce((closest, current) => {
    const closestDiff = Math.abs(parseInt(closest.top) - length);
    const currentDiff = Math.abs(parseInt(current.top) - length);

    return currentDiff < closestDiff ? current : closest;
  });

  return nearestItem;
}

export async function generateListPositions(_id: any) {
  try {
    const url = `${NEXT_PUBLIC_GET_TOPIC}?topicId=${String(
      _id
    )}&page=${1}&essentials=${"yes"}&process=${"yes"}`;

    const res = await fetch(url, {
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.error("Fetch failed");
      return { error: res.statusText };
    }

    const result = await res.json();
    const { data } = result;

    if (data.lists && data.lists.result) {
      for (let i = 0; i < data.lists.result.length; i++) {
        const tData = {
          _id: String(data.lists.result[i]._id),
          ranking_position: i + 1,
        };

        const formData = new FormData();
        formData.append("updateData", JSON.stringify(tData));
        const url = `${NEXT_PUBLIC_UPDATE_LIST}`;

        const response = await (
          await fetch(url, {
            cache: "no-store",
            method: "POST",
            body: formData,
          })
        ).json();
      }
    }

    const formData = new FormData();
    const topicD = {
      _id: String(_id),
      newly_updated: "yes",
    };
    formData.append("updateData", JSON.stringify(topicD));
    const turl = `${NEXT_PUBLIC_UPDATE_TOPIC}`;
    const response = await (
      await fetch(turl, {
        cache: "no-store",
        method: "POST",
        body: formData,
      })
    ).json();

    return true;
  } catch (error) {
    console.error(error);

    return {
      error: error.message || "error 857575",
    };
  }
}

export async function sendTopicImage(data, essentials = "no") {
  try {
    if (data) {
      const imageUrl = base_url(`api/images/topic/${data.slug}.png`);
      if (isNull(data.generatedImagePath) && isNull(data.featuredImagePath)) {
        await TopicProcessImage(imageUrl, data.slug, data._id);
      }

      if (data.lists && data.lists.result && essentials == "yes") {
        const promises = data.lists.result.map(async (item) => {
          const list_imageUrl = base_url(`/api/images/list/${item.slug}`);

          if (
            isNull(item.generatedImagePath) &&
            isNull(item.featuredImagePath)
          ) {
            await ListProcessImage(list_imageUrl, item.slug, item._id);
          }
        });
        Promise.all(promises);
      }

      return { success: true, msg: "uploaded" };
    } else {
      return { success: false, msg: "no data" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, msg: e };
  }
}

export async function TopicProcessImage(imageUrl, slug, id) {
  try {
    const uploadedUrl: any = await uploadToS3FromUrl(
      imageUrl,
      `gimages/topic/${slug}`
    );

    if (uploadedUrl.success) {
      const postData = {
        _id: id,
        slug: slug,
        newly_updated: "no",
        generatedImagePath: uploadedUrl.path,
      };

      return await updateTopicApi(postData);
    }
    return { success: false };
  } catch (e) {
    console.error(e.stack || e);
    return { success: false };
  }
}
