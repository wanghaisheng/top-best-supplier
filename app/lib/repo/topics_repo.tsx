"use server";
import {
  base_url,
  construct_sitemap,
  countWords,
  isNull,
  preFetch,
  stripHtmlTags,
} from "@/app/utils/custom_helpers";
import { customSlugify } from "@/app/utils/custom_slugify";
import {
  NEXT_PUBLIC_DELETE_TOPICS,
  NEXT_PUBLIC_GET_POPULAR_TOPICS,
  NEXT_PUBLIC_GET_TOPIC,
  NEXT_PUBLIC_GET_TOPICS,
  NEXT_PUBLIC_POST_TOPICS,
  SITEMAP_PER_PAGE,
} from "@/constants";

export async function getTopics(topId: any | "", page: any, perPage: any | "") {
  try {
    const url = `${NEXT_PUBLIC_GET_TOPICS}?topId=${topId}&page=${page}&perPage=${perPage}`;

    const response = await fetch(url, {
      next: {
        tags: ["topics", topId],
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (response.status === 200) {
      const posts = await response.json();
      return posts;
    } else {
      return { error: "Failed to fetch topics" };
    }
  } catch (error) {
    return { error: "An error occurred while fetching topic" };
  }
}

export async function getPopularTopics(_id, page, perPage) {
  try {
    const url = `${NEXT_PUBLIC_GET_POPULAR_TOPICS}?_id=${_id}&page=${page}&perPage=${perPage}`;

    const res = await fetch(url, {
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.log("Fetch failed");
      return { error: res.statusText };
    }
    const result = await res.json();

    return result.data;
  } catch (error) {
    return {
      error: error.message || "Failed to fetch data",
    };
  }
}

export async function getTopic(
  topicId: string,
  page = 1,
  perPage = 10,
  essentials = "yes"
) {
  try {
    const url = `${NEXT_PUBLIC_GET_TOPIC}?topicId=${topicId}&page=${page}&perPage=${perPage}&essentials=${essentials}&process=${"yes"}`;

    const res = await fetch(url, {
      next: {
        tags: ["topic", topicId],
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.error("Fetch failed");
      return {
        success: false,
        msg: "Failed to fetch topic",
        error: res.statusText,
      };
    }

    const result = await res.json();
    const { data } = result;

    return data;
  } catch (error) {
    console.error(error);

    return {
      success: false,
      msg: "Failed to fetch topic",
      error: error.message,
    };
  }
}

export async function postTopics(
  postData: any,
  isImport = "no",
  update = false,
  importTitle = ""
) {
  try {
    const url = `${NEXT_PUBLIC_POST_TOPICS}`;

    let formData = new FormData();
    formData.append(
      "postData",
      JSON.stringify({ postData, isImport, update, importTitle })
    );

    const result = await fetch(url, {
      cache: "no-store",
      method: "POST",
      body: formData,
    });

    return await result.json();
  } catch (error) {
    console.log(error);
    return { success: false, msg: "An error occurred while posting topics" };
  }
}

export async function deleteTopics(_id: any) {
  try {
    const url = `${NEXT_PUBLIC_DELETE_TOPICS}?id=${_id}`;

    const formData = new FormData();
    formData.append("deleteData", JSON.stringify(_id));

    const response = await (
      await fetch(url, {
        method: "DELETE",
        body: formData,
      })
    ).json();

    if (response.data) {
      return response;
    } else {
      return { success: false, msg: "Failed to delete topic" };
    }
  } catch (error) {
    return {
      success: false,
      msg: `Failed to delete topic: ${error.stack || error}`,
    };
  }
}

export async function metaTags(metadata, data) {
  const length = stripHtmlTags(
    data.description + " " + data.lists.result[0]?.description ?? ""
  );

  metadata.title = data.title;
  metadata.description = `This is ${data.title}`;
  metadata.alternates
    ? (metadata.alternates.canonical = `${process.env.NEXT_PUBLIC_BASE_URL}/${data.slug}`)
    : "";
  if (metadata.robots) {
    metadata.robots = {
      index:
        countWords(length) >= 300 && data.lists.result.length >= 1
          ? true
          : false,
      follow: true,
    };
  }
  return true;
}

export async function topicMetaTags(data) {
  try {
    if (isNull(data)) return data;

    let list_desc = "";
    if (
      data.lists &&
      data.lists.result &&
      data.lists.result[0] &&
      data.lists.result[0].description
    ) {
      list_desc = data.lists.result[0].description;
    }

    const length = stripHtmlTags(data.description + " " + list_desc);

    // Set canonical URL
    data.canonical = base_url(data.slug);

    // Set robots meta tags
    data.robots = {
      index:
        (!isNull(length) &&
          countWords(length) >= 300 &&
          data.lists.result.length >= 1) ||
        data.lists.result.length >= 1
          ? true
          : false,
      follow: true,
    };

    return data;
  } catch (error) {
    console.error("An error occurred while processing topic meta tags:", error);
    return data;
  }
}

export async function topics_for_sitemap(id: any) {
  let posts: any = [];

  if (id == 0) {
    posts = await getTopics("", 1, SITEMAP_PER_PAGE);
    const sml: any = [];

    if (posts && posts.data && posts.data.metadata) {
      for (let i = 0; i < posts.data.metadata.numPages; i++) {
        sml.push({
          url: construct_sitemap("topics", parseInt(`${i + 1}`)),
          changeFrequency: "weekly",
        });
      }

      return [...sml];
    } else {
      return [];
    }
  }

  posts = await getTopics("", parseInt(id), SITEMAP_PER_PAGE);

  if (isNull(posts.data.result)) {
    posts = await getTopics("", 1, SITEMAP_PER_PAGE);
  }

  return posts.data.result.map((item, i) => {
    const slug = `${process.env.NEXT_PUBLIC_BASE_URL}/${item.slug}`;
    //preFetch(slug);
    return {
      url: `${slug}`,
      changefreq: "weekly",
    };
  });
}
