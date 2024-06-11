import { ImageResponse } from "next/og";
import { base_images_url, base_url, isNull } from "@/app/utils/custom_helpers";
import { getTopic } from "@/app/roadmap/topics_roadmap";
import {
  CustomImageResponse,
  TopicImageGen,
} from "../../topic/topic_image_gen";
import { ListImageGen } from "../../list/list_image_gen";

//export const runtime = "edge";

export async function GET(
  request: any,
  { params }: { params: { path: any; id: string } }
) {
  try {
    if (params.path == "topic") {
      return TopicImageGen(params.id);
    } else if (params.path == "list") {
      return ListImageGen(params.id);
    }
  } catch (error) {
    return new ImageResponse(await CustomImageResponse(), {
      width: 1920,
      height: 1080,
    });
  }
}
