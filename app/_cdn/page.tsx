export async function GET(request: any) {
  const { searchParams } = new URL(request.url);

  const hasUrl = searchParams.has("url");

  return new Response(JSON.stringify({ success: false, msg: "error" }), {
    status: 200,
  });
}
