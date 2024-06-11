//"use client";
import PostBody from "@/app/posts/post_body";
import PopularTopics from "@/app/components/popular_topics";
import ListTable from "@/app/components/list_table";
import Lists from "../posts/lists";
import { notFound } from "next/navigation";
import { getTopic, topicMetaTags } from "../lib/repo/topics_repo";
import {
  base_images_url,
  base_url,
  checkImageValidity,
  generateBreadcrumb,
  isNull,
} from "../utils/custom_helpers";
import { Metadata } from "next";
import { ConstructMetadata } from "../seo/metadata";
import { buildSchema } from "../seo/schema";
import { schema } from "../layout";
import Revalidate from "../posts/refresh";
import { topicImage } from "../utils/topic_image";

export const revalidate = parseInt(
  String(process.env.NEXT_PUBLIC_RE_VALIDATE),
  10
);
export const maxDuration = 10;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const page = 1;
  let data = await getTopic(params.slug, page);
  data = await topicMetaTags(data);
  const breadcrumbData = [{ title: data.title, url: base_url(data.slug) }];
  return (await ConstructMetadata(data)) as Metadata;
}

export default async function Post({ params }: { params: { slug: string } }) {
  const page = 1;

  try {
    let data: any = await getTopic(params.slug, page);

    if (isNull(data)) {
      // If data is not found, return a 404 page
      return notFound();
    }

    // Generate metadata for the post
    await generateMetadata({ params });

    // Construct schema data for SEO
    schema.data = buildSchema(
      base_url(data.slug),
      data.title,
      base_images_url("logo.png"),
      generateBreadcrumb([{ title: data.title, url: base_url(data.slug) }]),
      data
    );

    data.processedImage = null;
    const pImage = await checkImageValidity(topicImage(data));
    if (pImage.success !== false) {
      data.processedImage = pImage;
    }

    return (
      <>
        <div className="mt-10">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 lg:fixed top-0 left-0 lg:h-screen p-2 sm:pt-10 mt-8 overflow-y-auto mx-auto z-0">
              <ListTable key="left" topicData={data} />
            </div>
            <section className="w-full md:w-2/4 p-4 mx-auto">
              <h1 className="text-2xl font-bold text-center py-12 bg-white">
                {data.title}
              </h1>

              <article
                className={`mb-5 bg-white shadow-xl ring-1 ring-gray-900/5 rounded`}
              >
                <PostBody post={data} />
                <div className="flex justify-end items-end m-2 p-2">
                  <Revalidate tag={data._id} url={base_url(data.slug)} />
                </div>
              </article>
              <Lists topicData={data} />
            </section>
            <div className="w-full md:w-1/4 lg:fixed top-0 right-0 lg:h-screen p-2 sm:pt-10 mt-8 overflow-y-auto mx-auto">
              <PopularTopics _id={data._id} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching post data:", error);
    return notFound();
  }
}
