import ListBody from "@/app/posts/list_body";
import PopularTopics from "@/app/components/popular_topics";
import { notFound } from "next/navigation";
import { getListById, listMetaTags } from "@/app/lib/repo/lists_repo";
import {
  base_images_url,
  base_url,
  generateBreadcrumb,
  get_list_url,
  isNull,
} from "@/app/utils/custom_helpers";
import QandAs from "@/app/posts/qandas";
import PopularLists from "@/app/components/popular_lists";
import { getListReviews } from "@/app/lib/repo/reviews_repo";
import { Metadata } from "next";
import { ConstructMetadata } from "@/app/seo/metadata";
import { schema } from "@/app/layout";
import { buildSchema } from "../../seo/schema";
import { listImage } from "@/app/utils/list_image";
import Revalidate from "@/app/posts/refresh";

export const revalidate = parseInt(
  String(process.env.NEXT_PUBLIC_RE_VALIDATE),
  10
);

export async function generateMetadata({
  params,
}: {
  params: { list_slug: string; slug: string };
}): Promise<Metadata> {
  try {
    const data = await getListById(params.list_slug);
    const result = await listMetaTags(data);

    return ConstructMetadata(result) as Metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    notFound();
  }
}

export default async function ListView({
  params,
}: {
  params: { list_slug: string; slug: string };
}) {
  try {
    const result = await getListById(params.list_slug);

    if (
      isNull(result) ||
      !result.topicData ||
      params.slug !== result.topicData.slug
    ) {
      notFound();
    }

    const data = result;

    const reviews = await getListReviews(data._id, data.place_id);

    await generateMetadata({ params });

    schema.data = buildSchema(
      base_url(result.slug),
      result.title,
      base_images_url("logo.png"),
      generateBreadcrumb([
        { title: result.topicData.title, url: base_url(result.topicData.slug) },
        {
          title: result.title,
          url: base_url(`${result.topicData.slug}/${result.slug}`),
        },
      ]),
      result
    );

    data.processedImage = listImage(data);

    return (
      <main>
        <div className="relative  z-0">
          <div className="w-full lg:w-7/12 lg:mt-2 mt-2 lg:ml-4">
            <h1 className="text-2xl font-bold text-left pb-12 pt-6 ml-10">
              {data.title}
            </h1>

            <ListBody post={data} reviews={reviews} />
            <div className="flex justify-end items-end m-2 p-2">
              <Revalidate tag={data._id} url={get_list_url(data)} />
            </div>
            <QandAs listData={data} />
          </div>

          <div className="w-full lg:w-1/5 lg:h-screen lg:mt-12 mt-2 lg:fixed lg:ml-14 lg:left-2/3 lg:top-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2">
            <PopularLists _id={data._id} />
          </div>

          <div className="w-full lg:w-1/5 lg:h-screen lg:mt-12 mt-2 top-0 right-0 lg:fixed">
            <PopularTopics _id={data._id} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    notFound();
  }
}
