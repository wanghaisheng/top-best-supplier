import {
  removeImport,
  removeList,
  removeQandA,
  removeTop,
  removeTopics,
} from "../../mongodb/query";

export async function DELETE(request, { params }) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  let action = params.action;
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");

  try {
    if (action === "delete_import") {
      const data = await deleteImport(id);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: headers,
      });
    }

    if (action === "delete_list") {
      const data = await deleteList(id);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    if (action === "delete_top") {
      const data = await deleteTop(id);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }

    if (action === "delete_topics") {
      const data = await deleteTopics(id);
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: headers,
      });
    }

    if (action === "delete_qanda") {
      const data = await deleteQandA(id);
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: headers,
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, msg: `${error}` }));
  }
  //...............GET........................

  return new Response(
    JSON.stringify({ success: false, msg: "Can't process your request" })
  );
}

async function deleteImport(id: any) {
  try {
    return await removeImport(id);
  } catch (e) {
    return { success: false, msg: String(e), data: "" };
  }
}

async function deleteTopics(id: any) {
  try {
    return await removeTopics(id);
  } catch (e) {
    return { success: false, msg: String(e), data: "" };
  }
}

async function deleteQandA(formData: any) {
  const deleteData = JSON.parse(formData.get("deleteData"));
  try {
    return await removeQandA(deleteData._id);
  } catch {
    return { data: "not_found" };
  }
}

async function deleteList(formData: any) {
  const deleteData = JSON.parse(formData.get("deleteData"));
  try {
    return await removeList(deleteData._id);
  } catch {
    return { data: "not_found" };
  }
}

async function deleteTop(id: any) {
  try {
    return await removeTop(id);
  } catch {
    return { data: "not_found" };
  }
}
