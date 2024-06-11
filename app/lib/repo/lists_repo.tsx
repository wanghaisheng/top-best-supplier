"use server";
import {
  base_url,
  construct_sitemap,
  countWords,
  getViewUrl,
  isNull,
  preFetch,
  stripHtmlTags,
} from "@/app/utils/custom_helpers";
import { customSlugify } from "@/app/utils/custom_slugify";
import {
  NEXT_PUBLIC_DELETE_LIST,
  NEXT_PUBLIC_GET_LIST,
  NEXT_PUBLIC_GET_LISTS,
  NEXT_PUBLIC_GET_POPULAR_LISTS,
  NEXT_PUBLIC_POST_LISTS,
  NEXT_PUBLIC_POST_TOPICS,
  NEXT_PUBLIC_UPDATE_LIST,
  SITEMAP_PER_PAGE,
} from "@/constants";
import { getTopic } from "./topics_repo";

export async function getLists(
  topicId: any | "",
  page: number,
  perPage: any | ""
) {
  try {
    const url = `${NEXT_PUBLIC_GET_LISTS}?topicId=${topicId}&page=${page}&perPage=${perPage}`;

    const response = await fetch(url, {
      next: {
        tags: ["lists", topicId],
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (response.status === 200) {
      const posts = await response.json();

      return posts;
    } else {
      return { error: "Failed to fetch lists" };
    }
  } catch (error) {
    return { error: "An error occurred while fetching list" };
  }
}

export async function getListById(id: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_LIST}?listId=${id}&essentials=yes&process=yes`;

    const res = await fetch(url, {
      next: {
        tags: ["list", id],
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.error("Fetch failed");
      return { error: res.statusText };
    }

    const result = await res.json();
    const { data } = result;

    return data;
  } catch (error) {
    console.error(error);

    return {
      error: error.message || `Failed to fetch list ${id} 874664`,
    };
  }
}

export async function UpdateList(tData: any) {
  try {
    const url = `${NEXT_PUBLIC_UPDATE_LIST}`;

    let formData = new FormData();
    formData.append("updateData", JSON.stringify(tData));

    const result = await fetch(url, {
      cache: "no-store",
      method: "POST",
      body: formData,
    });

    if (result.status === 200) {
      return await result.json();
    } else {
      return { error: "Failed to update a list" };
    }
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while updating list" };
  }
}

export async function postLists(
  postData: any,
  isImport = "no",
  update = false,
  importTitle = ""
) {
  try {
    const url = `${NEXT_PUBLIC_POST_LISTS}`;
    let formData = new FormData();
    formData.append(
      "postData",
      JSON.stringify({ postData, isImport, update, importTitle })
    );

    const result = await (
      await fetch(url, {
        cache: "no-store",
        method: "POST",
        body: formData,
      })
    ).json();

    return result;
  } catch (error) {
    console.error(error);
    return { success: false, msg: "An error occurred while posting list" };
  }
}

export async function deleteList(_id: string) {
  try {
    const url = `${NEXT_PUBLIC_DELETE_LIST}`;

    const formData = new FormData();
    formData.append("deleteData", JSON.stringify({ _id }));

    const response = await fetch(url, {
      method: "DELETE",
      body: formData,
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      return { error: "Failed to delete list" };
    }
  } catch (error) {
    return { error: "An error occurred while deleting list" };
  }
}

export async function listMetaTags(data) {
  if (isNull(data)) return data;
  const length = stripHtmlTags(data.description);

  if (data.topicData && data.topicData.category) {
    data.title = `${data.title} - ${data.topicData.category}`;
  }

  data.canonical = base_url(`${data.topicData.slug}/${data.slug}`);
  data.robots = {
    index: countWords(length) >= 30 || data.type == "gmap" ? false : false,
    follow: true,
  };
  return data;
}

export async function getPopularLists(_id, page, perPage) {
  try {
    const url = `${NEXT_PUBLIC_GET_POPULAR_LISTS}?_id=${_id}&page=${page}&perPage=${perPage}&essentials=yes`;

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

    return result.data;
  } catch (error) {
    return {
      error: error.message || "Failed to fetch data",
    };
  }
}

export async function lists_for_sitemap(id: any) {
  let posts: any = [];
  const sml: any = [];

  if (id == 0) {
    posts = await getLists("", 1, SITEMAP_PER_PAGE);
    if (posts && posts.data && posts.data.metadata) {
      for (let i = 0; i < posts.data.metadata.numPages; i++) {
        sml.push({
          url: construct_sitemap("lists", parseInt(`${i + 1}`)),
          changeFrequency: "monthly",
        });
      }
      return [...sml];
    } else {
      return [];
    }
  }

  posts = await getLists("", parseInt(id), SITEMAP_PER_PAGE);

  if (isNull(posts.data.result)) {
    posts = await getLists("", 1, SITEMAP_PER_PAGE);
  }
  const promise = posts.data.result.map(async (item, i) => {
    let topic_slug = "";

    if (!isNull(item.topic_slug)) {
      topic_slug = item.topic_slug;
    } else {
      const topic = await getTopic(item["topicId"]);

      if (topic.slug) {
        topic_slug = topic.slug;
      }
    }
    const slug = `${process.env.NEXT_PUBLIC_BASE_URL}/${topic_slug}/${item.slug}`;
    //preFetch(slug);

    return {
      url: `${slug}`,
      changefreq: "monthly",
    };
  });

  return Promise.all(promise);
}
