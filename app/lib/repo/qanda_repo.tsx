import {
  NEXT_PUBLIC_DELETE_QANDA,
  NEXT_PUBLIC_GET_QANDA,
  NEXT_PUBLIC_POST_POST_QANDAS,
  NEXT_PUBLIC_POST_UPDATE_QANDA,
} from "@/constants";

export async function getQandA(id: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_QANDA}?id=${id}`;

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
      error: error.message || "Failed to fetch qanda",
    };
  }
}

export async function postQandAs(
  postData: any,
  isImport = "no",
  update = false
) {
  try {
    const url = `${NEXT_PUBLIC_POST_POST_QANDAS}`;
    let formData = new FormData();
    formData.append("postData", JSON.stringify({ postData, isImport, update }));

    console.log(postData);

    const result = await (
      await fetch(url, {
        cache: "no-store",
        method: "POST",
        body: formData,
      })
    ).json();

    return result;
  } catch (error) {
    console.log(error);
    return { success: false, msg: "An error occurred while posting list" };
  }
}

export async function updateQandA(tData: any) {
  try {
    const url = `${NEXT_PUBLIC_POST_UPDATE_QANDA}`;

    console.log(tData);
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
      return { error: "Failed to update a qanda" };
    }
  } catch (error) {
    console.log(error);
    return { error: "An error occurred while updating topic" };
  }
}

export async function deleteQandA(_id: string) {
  try {
    const url = `${NEXT_PUBLIC_DELETE_QANDA}`;

    const formData = new FormData();
    formData.append("deleteData", JSON.stringify({ _id }));

    const response = await fetch(url, {
      method: "DELETE",
      body: formData,
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      return { error: "Failed to delete QandA" };
    }
  } catch (error) {
    return { error: "An error occurred while deleting QandA" };
  }
}
