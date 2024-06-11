import { MetadataRoute } from "next";
import { base_url, construct_sitemap } from "@/app/utils/custom_helpers";
import { lists_for_sitemap } from "@/app/lib/repo/lists_repo";

export const revalidate = parseInt(String("600"), 10);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let result: any = [];
  try {
    const index = [{ url: base_url("sitemap.xml"), changeFrequency: "hourly" }];
    result = [...index, ...(await lists_for_sitemap(0))];
    return result;
  } catch (e) {
    console.error(e);
    result = [];
    return result;
  }
}
