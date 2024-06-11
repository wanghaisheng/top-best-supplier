import { customSlugify } from "@/app/utils/custom_slugify";
import {
  NEXT_PUBLIC_GET_TEMPLATE,
  NEXT_PUBLIC_GET_TEMPLATES,
  NEXT_PUBLIC_POST_POST_TEMPLATES,
  NEXT_PUBLIC_POST_UPDATE_TEMPLATE,
} from "@/constants";

export async function updateTemplate(tData: any) {
  try {
    const url = `${NEXT_PUBLIC_POST_UPDATE_TEMPLATE}`;

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
      return { error: "Failed to update a topic" };
    }
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while updating topic" };
  }
}

export async function getTemplate(id: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_TEMPLATE}?id=${id}`;


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
    const { data } = result;

    return data;
  } catch (error) {
    console.error(error);

    return {
      error: error.message || "Failed to fetch template",
    };
  }
}

export async function getTemplates(page: string, perPage: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_TEMPLATES}?page=${page}&perPage=${perPage}`;

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
    const { data } = result;

    return data;
  } catch (error) {
    console.error(error);

    return {
      error: error.message || "Failed to fetch template",
    };
  }
}

export async function postTemplates(tData: any) {
  try {
    const slugs = tData.map((t) => customSlugify(t.slug));

    // Fetch existing topics by slug
    const topics = await Promise.all(slugs.map(getTemplate));

    // Assign isDuplicate and id
    tData.forEach((t, i) => {
      tData[i].isUpdated = true;
      tData[i]._id = topics[i]._id ? topics[i]._id : null;

      if (topics[i] === "not_found" || topics[i] === "undefined") {
        tData[i].isDuplicate = false;
        tData[i]._id = topics[i]._id ? topics[i]._id : null;
        tData[i].isUpdated = false;
        tData[i].body = tData[i].body ? JSON.stringify(tData[i].body) : [];
      } else {
        tData[i].body = [...JSON.parse(topics[i].body), ...tData[i].body];

        console.log(topics[i].body);
      }
    });

    const url = `${NEXT_PUBLIC_POST_POST_TEMPLATES}`;

    let formData = new FormData();
    formData.append("postData", JSON.stringify(tData));

    const result = await fetch(url, {
      cache: "no-store",
      method: "POST",
      body: formData,
    });

    if (result.status === 200) {
      return await result.json();
    } else {
      return { error: "Failed to fetch topic" };
    }
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while posting topics" };
  }
}
