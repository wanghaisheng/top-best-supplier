import { NEXT_PUBLIC_GET_REVIEWS } from "@/constants";

export async function getListReviews(id: string, place_id: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_REVIEWS}?listId=${id}&placeId=${place_id}&essentials=yes&page=1&perPage=20`;

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
      error: error.message || `Failed to fetch list ${id} 874664`,
    };
  }
}
