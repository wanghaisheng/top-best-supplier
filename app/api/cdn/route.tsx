import { revalidate } from "@/app/page";
import axios from "axios";
import sharp from "sharp";

//export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const { searchParams, search } = new URL(request.url);

    let url = search.replace("?url=", "");
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    let originalImageBuffer = Buffer.from(response.data);

    if (originalImageBuffer.length > 1024 * 1024) {
      // Reduce image quality if size is above 1 MB
      const modifiedImageBuffer = await sharp(originalImageBuffer)
        .jpeg({ quality: 100 })
        .toBuffer();

      originalImageBuffer = modifiedImageBuffer;
    }

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Content-Type", "image/png");
    newHeaders.set(
      "Cache-Control",
      `public, max-age=${process.env.NEXT_PUBLIC_RE_VALIDATE}`
    );

    return new Response(originalImageBuffer);
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, msg: `image not available ${e}` }),
      {
        status: 500,
      }
    );
  }
}
