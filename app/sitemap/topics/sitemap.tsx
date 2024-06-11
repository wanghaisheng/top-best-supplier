import { MetadataRoute } from "next";
import { topics_for_sitemap } from "@/app/lib/repo/topics_repo";
import { base_url, construct_sitemap} from "@/app/utils/custom_helpers";

export const revalidate = parseInt(String("600"), 10);


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  let result: any = [];
  try {
    const index = [{url: base_url('sitemap.xml'), changeFrequency: "hourly"}]
    result = [...index, ...(await topics_for_sitemap(0))];
    return result;
  } catch (e) {
    console.error(e);
    result = []
    return result;
  }
}

