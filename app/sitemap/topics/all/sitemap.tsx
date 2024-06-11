import { getTopics, topics_for_sitemap } from "@/app/lib/repo/topics_repo";
import { base_url } from "@/app/utils/custom_helpers";
import { SITEMAP_PER_PAGE } from "@/constants";
import { MetadataRoute } from "next";

export async function generateSitemaps() {
  const objects: any = [];
  for (let i = 0; i < 100; i++) {
    objects.push({ id: i + 1 });
  }
  return objects;
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  try {
    const posts = await getTopics("", id, SITEMAP_PER_PAGE);
    const index = [{ url: base_url("sitemap.xml"), changeFrequency: "hourly" }];
    const data = await topics_for_sitemap(id);
    return [...index, ...data];
  } catch (e) {
    return [];
  }
}
