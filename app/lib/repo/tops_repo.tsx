import { customSlugify } from "@/app/utils/custom_slugify";
import {
  NEXT_PUBLIC_DELETE_TOP,
  NEXT_PUBLIC_GET_TOP,
  NEXT_PUBLIC_GET_TOPS,
  NEXT_PUBLIC_POST_TOPICS,
  NEXT_PUBLIC_POST_TOPS,
} from "@/constants";

export async function getTops() {
  try {
    const url = `${NEXT_PUBLIC_GET_TOPS}`;

    const res = await fetch(url, {
      next: {
        tags: ["home"],
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.log("Fetch failed");
      return { error: res.statusText };
    }

    const result = await res.json();

    const data = result.data;

    return data;
  } catch (error) {
    console.error(error);
    return {
      error: error.message || "Failed to fetch data",
    };
  }
}

export async function getTop(id: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_TOP}?id=${id}`;

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
      error: error.message || "Failed to fetch data",
    };
  }
}

export async function postTops(postData: any, isImport = "no", update = false) {
  try {
    const url = `${NEXT_PUBLIC_POST_TOPS}`;

    let formData = new FormData();
    formData.append("postData", JSON.stringify({ postData, isImport, update }));

    const result = await fetch(url, {
      cache: "no-store",
      method: "POST",
      body: formData,
    });

    return await result.json();
  } catch (error) {
    console.log(error);
    return { status: false, msg: "An error occurred while posting tops" };
  }
}

export async function deleteTop(_id: string) {
  try {
    const url = `${NEXT_PUBLIC_DELETE_TOP}?id=${_id}`;

    const formData = new FormData();
    formData.append("deleteData", JSON.stringify({ _id }));

    const response = await fetch(url, {
      method: "DELETE",
      body: formData,
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      return { success: false, msg: "Failed to delete top" };
    }
  } catch (error) {
    return { success: false, msg: "An error occurred while deleting top" };
  }
}
