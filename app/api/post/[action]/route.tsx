import {
  updateATopic,
  addImport,
  updateATemplate,
  addTemplate,
  updateAQandA,
  updateATop,
  addFiles,
} from "@/app/api/mongodb/query";

import { TopicModel } from "@/app/models/topic_model";
import { customSlugify } from "@/app/utils/custom_slugify";
import { NEXT_PUBLIC_POST_UPDATE_TEMPLATE } from "@/constants";
import { beforeUpdate, isNull } from "@/app/utils/custom_helpers";
import { TempModel } from "@/app/models/templates_model";
import { QandAModel } from "@/app/models/qanda_model";
import { TopModel } from "@/app/models/top_model";
import generateImportId from "@/app/lib/repo/import_repo";
import { FileModel } from "@/app/models/file_model";
import { postTopics } from "../../api_repos/topics_api_repo";
import { postTops } from "../../api_repos/tops_api_repo";
//import { ListsModel, postListsApi } from "@/app/roadmap/lists_roadmap";
import { postQandaApi } from "../../api_repos/qanda_api_repo";
import { postListsApi, updateList } from "../../api_repos/lists_api_repo";
import { postReviews } from "../../api_repos/reviews_api_repo";

export async function POST(
  request: Request,
  { params }: { params: { action: string } }
) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  let action = params.action;

  let formData: any = {};
  try {
    formData = await request.formData();
  } catch (error) {
    formData = await request.json();
  }

  //creating topics
  if (action == "post_tops") {
    const data = await postTops(formData);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  }

  //creating tops
  if (action == "update_top") {
    const data = await updateTop(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  //creating topics
  if (action == "post_topics") {
    const data = await postTopics(formData);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  }

  //creating topics
  if (action == "post_reviews") {
    const data = await postReviews(formData);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  }

  //creating topics
  if (action == "post_business") {
    const data = await postReviews(formData);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  }

  //creating topics
  if (action == "update_topic") {
    const data = await updateTopicApi(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  //creating list
  if (action == "post_lists") {
    const data = await postListsApi(formData);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  }

  //updating list
  if (action == "update_list") {
    const data = await updateList(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  //updating list
  if (action == "create_import") {
    const response = await createImport(formData);
    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: headers,
    });
  }

  //updating template
  if (action == "update_template") {
    const data = await updateTemplate(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  //creating topics
  if (action == "post_templates") {
    const data = await postTemplates(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  if (action == "post_qandas") {
    const data = await postQandaApi(formData);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  }

  if (action == "update_qanda") {
    const data = await updateQanda(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  if (action == "post_files") {
    const data = await postFiles(formData);
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: headers,
    });
  }

  // Default response for invalid actions
  return new Response(JSON.stringify({ data: "Invalid action" }), {
    status: 400,
    headers: headers,
  });
}

export async function updateTopicApi(formData: any) {
  let updateData: any = {};

  try {
    updateData = JSON.parse(formData.get("updateData"));
  } catch (e) {
    updateData = formData;
  }

  let uData: TopicModel = {};

  uData = beforeUpdate(updateData, uData);

  try {
    return await updateATopic(updateData._id, uData);
  } catch {
    return "47747 error";
  }
}

export async function updateTemplate(formData: any) {
  const updateData = JSON.parse(formData.get("updateData"));

  const uData: TempModel = {};

  if (!isNull(updateData.title)) {
    uData.title = updateData.title;
  }

  if (updateData.body) {
    uData.body = JSON.stringify(updateData.body);
  }

  uData.updatedAt = new Date();

  try {
    return await updateATemplate(updateData._id, uData);
  } catch {
    return "47747 error";
  }
}

export async function updateQanda(formData: any) {
  const updateData = JSON.parse(formData.get("updateData"));

  const uData: QandAModel = {};

  if (!isNull(updateData.title)) {
    uData.title = updateData.title;
  }

  if (updateData.body) {
    uData.body = JSON.stringify(updateData.body);
  }

  if (updateData.steps) {
    uData.steps = JSON.stringify(updateData.steps);
  }

  uData.updatedAt = new Date();

  try {
    return await updateAQandA(updateData._id, uData);
  } catch {
    return "47747 error";
  }
}

async function updateTop(formData: any) {
  const updateData = JSON.parse(formData.get("updateData"));

  let uData: TopModel = {};

  uData = beforeUpdate(updateData, uData);

  try {
    await updateATop(updateData._id, uData);
    return { success: true };
  } catch {
    return "474646 error";
  }
}

async function createImport(formData: any) {
  const postData = JSON.parse(formData.get("postData"));

  const data = {
    title: `${postData.title} (${postData.length})`,
    length: postData.length,
    createdAt: new Date(),
  };
  try {
    return await addImport(data);
  } catch {
    return "8764664 error";
  }
}

async function postTemplates(formData: any) {
  const postData = JSON.parse(formData.get("postData"));

  const data: TempModel[] = new Array();

  postData.map(
    async (post: {
      title: string;
      body: any | null;
      topId: any | null;
      slug: string;
      isDuplicate: boolean | null;
      _id: any;
    }) => {
      let postSlug = customSlugify(post.slug);

      const tData: TempModel = {
        title: post.title,

        body: post.body,
        createdAt: new Date(),
        slug: postSlug,
      };

      if (post.isDuplicate === true) {
        const formData = new FormData();
        tData._id = post._id;
        formData.append("updateData", JSON.stringify(tData));
        const url = `${NEXT_PUBLIC_POST_UPDATE_TEMPLATE}`;
        try {
          const response = await fetch(url, {
            cache: "no-store",
            method: "POST",
            body: formData,
          });
          const result = await response.json();
        } catch (error) {
          console.error("error 7464664");
        }
      } else {
        data.push(tData);
      }
    }
  );

  try {
    if (Array.isArray(data) && data !== null && data.length > 0) {
      const importId = await generateImportId("test", data);
      data.map((im, i) => {
        data[i].importId = importId;
      });

      await addTemplate(data);
    }
    return postData;
  } catch {
    return "474646 error";
  }
}

async function postFiles(formData: any) {
  const postData = JSON.parse(formData.get("postData"));

  const data: FileModel[] = new Array();

  postData.map(async (post) => {
    const tData: FileModel = {
      title: post.title,
      size: post.size,
      path: post.path,
      provider: post.provider,
      type: post.type,
      createdAt: new Date(),
      slug: post.slug,
    };

    data.push(tData);
  });

  try {
    if (Array.isArray(data) && data !== null && data.length > 0) {
      await addFiles(data);
    }
    return postData;
  } catch {
    return "4773646 error";
  }
}
