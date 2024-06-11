import { sendListImage } from "@/app/api/api_repos/lists_api_repo";
import { sendTopicImage } from "@/app/api/api_repos/topics_api_repo";
import {
  getTops,
  getTopics,
  getTopic,
  getPopularTopics,
  getLists,
  getList,
  getUser,
  getTop,
  fetchImports,
  fetchTemplates,
  fetchTemplate,
  fetchQandAs,
  fetchAQandA,
  fetchFiles,
  getPopularLists,
  getBusiness,
  getReviews,
} from "@/app/api/mongodb/query";

export async function GET(
  request: any,
  { params }: { params: { action: string } }
) {
  const { searchParams } = new URL(request.url);
  let limit = searchParams.get("limit") || "";
  let topId = searchParams.get("topId") || "";
  let id = searchParams.get("id") || "";
  let _id = searchParams.get("_id") || "";
  let topicId = searchParams.get("topicId") || "";
  let listId = searchParams.get("listId") || "";
  let placeId = searchParams.get("placeId") || "";
  let uid = searchParams.get("uid") || "";
  let q = searchParams.get("q") || "";
  let rand = searchParams.get("rand") || "";
  let process = searchParams.get("process") || "";
  let essentials = searchParams.get("essentials") || "";
  let page = parseInt(searchParams.get("page") as string, 10);
  let perPage = parseInt(searchParams.get("perPage") as string, 10);
  let action = params.action;

  limit = "10";

  //fetching topics
  if (action == "topic") {
    const data = await fetchTopic(topicId, "yes", "10", process);

    let res = {};
    if (data) {
      res = await sendTopicImage(data, "no");
    }
    return new Response(JSON.stringify({ res }), {
      status: 200,
    });
  }

  //fetching list
  if (action == "list") {
    const data = await fetchList(listId, "no", "no");

    let res = {};
    if (data) {
      res = await sendListImage(data, "no");
    }
    return new Response(JSON.stringify({ res }), {
      status: 200,
    });
  }

  return new Response(
    JSON.stringify({ data: {}, msg: "action not found", success: false }),
    {
      status: 400,
    }
  );
}

async function fetchTopics(
  topId: string | number | null,
  page: number,
  perPage: number,
  essentials: any,
  process: any,
  q: string | number | null
) {
  try {
    return await getTopics(topId, page, perPage, essentials, process, q);
  } catch {
    return { msg: "84746 error", success: false };
  }
}

async function fetchTopic(id: any, essentials: any, page: any, process: any) {
  try {
    return await getTopic(id, essentials, page, 10, process);
  } catch {
    console.error("error: 8475775");
    return "not_found";
  }
}

async function fetchList(listId: string | number | null, essentials, process) {
  try {
    return await getList(listId, essentials, process);
  } catch {
    return { msg: "error: 6454554" };
  }
}
