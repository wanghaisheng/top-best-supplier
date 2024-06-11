import {
  NEXT_PUBLIC_CREATE_IMPORT,
  NEXT_PUBLIC_DELETE_IMPORT,
  NEXT_PUBLIC_GET_IMPORTS,
} from "@/constants";

export async function getImports(page: number, perPage: any | "") {
  try {
    const url = `${NEXT_PUBLIC_GET_IMPORTS}?page=${page}&perPage=${perPage}`;

    const response = await fetch(url, {
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (response.status === 200) {
      return await response.json();
    } else {
      return { error: "Failed to fetch topics" };
    }
  } catch (error) {
    return { error: "An error occurred while fetching topic" };
  }
}

export async function deleteImports(_id: any) {
  try {
    const url = `${NEXT_PUBLIC_DELETE_IMPORT}?id=${_id}`;

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
      return { success: false, msg: "Failed to delete import" };
    }
  } catch (error) {
    return {
      success: false,
      msg: `Failed to delete import: ${error.stack || error}`,
    };
  }
}

export default async function generateImportId(title, data) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}${NEXT_PUBLIC_CREATE_IMPORT}`;
  const tD = {
    title: title,
    length: data.length,
  };

  let formData = new FormData();
  formData.append("postData", JSON.stringify(tD));

  const response = await fetch(url, {
    cache: "no-store",
    method: "POST",
    body: formData,
  });
  const result = await response.json();

  return result.response;
}
