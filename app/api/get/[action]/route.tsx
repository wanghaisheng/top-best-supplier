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
import { sendTopicImage } from "../../api_repos/topics_api_repo";
import { isNull } from "@/app/utils/custom_helpers";
import { sendListImage } from "../../api_repos/lists_api_repo";

export async function GET(
  request: any,
  { params }: { params: { action: string } }
) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    const { searchParams } = new URL(request.url);
    let limit = searchParams.get("limit");
    let topId = searchParams.get("topId");
    let id = searchParams.get("id");
    let _id = searchParams.get("_id");
    let topicId = searchParams.get("topicId");
    let listId = searchParams.get("listId");
    let placeId = searchParams.get("placeId");
    let uid = searchParams.get("uid");
    let q = searchParams.get("q");
    let rand = searchParams.get("rand");
    let process = searchParams.get("process");
    let process_images = searchParams.get("process_images") || "yes";
    let essentials = searchParams.get("essentials");
    let page = parseInt(searchParams.get("page") as string, 10);
    let perPage = parseInt(searchParams.get("perPage") as string, 10);
    let action = params.action;

    limit = "10";

    //...............GET........................

    //fetching tops
    if (action == "get_tops") {
      const data = await fetchTops(page, perPage, q);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching a top
    if (action == "get_top") {
      const data = await fetchTop(id);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching topics
    if (action == "get_topics") {
      const data = await fetchTopics(
        topId,
        page,
        perPage,
        essentials,
        process,
        q
      );

      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching topic info
    if (action == "get_topic") {
      const data = await fetchTopic(topicId, "yes", "10", process);

      if (process_images == "yes" && !isNull(data)) {
        sendTopicImage(data);
      }

      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching popular topic
    if (action == "get_popular_topics") {
      const data = await fetchPopularTopics(_id, page, perPage);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching popular topic
    if (action == "get_popular_lists") {
      const data = await fetchPopularLists(_id, essentials, page, perPage);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }
    //fetching lists
    if (action == "get_lists") {
      const data = await fetchLists(
        topicId,
        page,
        perPage,
        essentials,
        process
      );
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }
    //fetching list info
    if (action == "get_list") {
      const data = await fetchList(listId, essentials, process);

      if (process_images == "yes" && !isNull(data)) {
        sendListImage(data);
      }

      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    if (action == "get_business") {
      const data = await fetchBusiness(id, essentials, process);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    if (action == "get_reviews") {
      const data = await fetchReview(
        id,
        listId,
        placeId,
        essentials,
        page,
        perPage
      );
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching a user
    if (action == "get_user") {
      const data = await fetchUser(uid);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching a user
    if (action == "get_imports") {
      const data = await getImports();
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching templates
    if (action == "get_templates") {
      const data = await getTemplates(page, perPage);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    ///
    if (action == "get_template") {
      const data = await getTemplate(id, rand);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    if (action == "get_qandas") {
      const data = await getQandAs(listId, page, perPage, process);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    if (action == "get_qanda") {
      const data = await getQandA(id, rand);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //fetching a user
    if (action == "get_files") {
      const data = await getFiles();
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    //.....................PUT.......................

    //return info
    return new Response(JSON.stringify({ data: "please define get action" }), {
      status: 400,
      headers: headers,
    });
  } catch (e) {
    //return info
    return new Response(JSON.stringify({ data: "error", msg: e }), {
      status: 400,
    });
  }
}

async function fetchTops(page: number, perPage: number, q: any) {
  try {
    return await getTops(page, perPage, "yes", q);
  } catch (e) {
    return { data: "839847 error" };
  }
}

async function fetchTop(id: any) {
  try {
    return await getTop(id);
  } catch {
    return { data: "746466 error" };
  }
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
    return { msg: "84746 error" };
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

async function fetchPopularTopics(_id: any, page: number, perPage: number) {
  try {
    return await getPopularTopics(_id, page, perPage);
  } catch {
    return { data: "87476 error" };
  }
}

async function fetchPopularLists(
  _id: any,
  essentials: any,
  page: number,
  perPage: number
) {
  try {
    return await getPopularLists(_id, essentials, page, perPage, "yes");
  } catch {
    return { data: "87476 error" };
  }
}

async function fetchLists(
  topicId: string | number | null,
  page: number,
  perPage: number,
  essentials: any,
  process: any
) {
  try {
    return await getLists(topicId, page, perPage, essentials, process);
  } catch {
    return { msg: "74746 error" };
  }
}

async function fetchList(listId: string | number | null, essentials, process) {
  try {
    return await getList(listId, essentials, process);
  } catch {
    return { msg: "error: 6454554" };
  }
}

async function fetchBusiness(id: string | number | null, essentials, process) {
  try {
    return await getBusiness(id, essentials, process);
  } catch {
    return { msg: "error: 6454554" };
  }
}

async function fetchReview(
  id: string | number | null,
  listId,
  placeId,
  essentials,
  page,
  perPage
) {
  try {
    return await getReviews(id, listId, placeId, essentials, page, perPage);
  } catch {
    return { msg: "error: 6454554" };
  }
}

async function fetchUser(uid: string | number | null) {
  try {
    return await getUser(uid);
  } catch {
    return { data: "847487747 error" };
  }
}

async function getImports() {
  try {
    return await fetchImports();
  } catch {
    return { msg: "847984747 error" };
  }
}

async function getTemplates(page: any, perPage: any) {
  try {
    return await fetchTemplates();
  } catch {
    return { msg: "847874747 error" };
  }
}

async function getTemplate(templateId: any, rand: any) {
  try {
    return await fetchTemplate(templateId, rand);
  } catch {
    return { msg: "887474747 error" };
  }
}

async function getQandA(id: any, rand: any) {
  try {
    return await fetchAQandA(id, rand);
  } catch (e) {
    console.error(e);
    return { msg: "8487674747 error", e: e };
  }
}

async function getQandAs(listId: any, page: any, perPage: any, process) {
  try {
    return await fetchQandAs(listId, page, perPage, process);
  } catch {
    return { msg: "84877874747 error" };
  }
}

async function getFiles() {
  try {
    return await fetchFiles();
  } catch {
    return { msg: "848947 error" };
  }
}
