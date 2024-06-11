import React, { useState } from "react";
import PopularTopics from "@/app/components/popular_topics";
import { notFound } from "next/navigation";
import { SingleShimmer } from "@/app/components/shimmer";
//import { getListById, listMetaTags } from "@/app/lib/repo/lists_repo";
import {
  countWords,
  getViewUrl,
  isNull,
  stripHtmlTags,
} from "@/app/utils/custom_helpers";
import { schema } from "@/app/layout";
import { buildSchema } from "@/app/seo/schema";
import { Metadata } from "next";
import { ConstructMetadata } from "@/app/seo/metadata";
import { getQandA } from "@/app/lib/repo/qanda_repo";
import QandABody from "@/app/posts/qanda_body";
import PopularLists from "@/app/components/popular_lists";

export async function generateMetadata({
  params,
}: {
  params: { qanda_slug: string };
}): Promise<Metadata> {
  const result = await await getQandA(params.qanda_slug);

  const breadcrumb: {
    "@type": string;
    position: string;
    item: {
      "@id": string;
      name: string;
    };
  }[] = [];

  breadcrumb.push({
    "@type": "ListItem",
    position: "1",
    item: {
      "@id": getViewUrl("", "topic"),
      name: "Home",
    },
  });

  breadcrumb.push({
    "@type": "ListItem",
    position: "2",
    item: {
      "@id": getViewUrl("", "topic"),
      name: result.title,
    },
  });

  schema.data = buildSchema(
    getViewUrl(result.slug, "topic"),
    "Topingnow",
    "/images/logo.png",
    breadcrumb,
    result
  );

  return ConstructMetadata(result) as {};
}

export default async function ListView({
  params,
}: {
  params: { slug: string; list_slug: string; qanda_slug: string };
}) {
  const result = await getQandA(params.qanda_slug);

  if (isNull(result)) {
    notFound();
  }

  const data = result;

  const metadata = await generateMetadata({ params });

  let postTitle = data.title;
  let postSteps = JSON.parse(data.steps);
  if (Array.isArray(postSteps) && postSteps.length > 0) {
    postTitle = `${data.title}`;
  }

  return (
    <main>
      <h1 className="text-2xl font-bold text-left pb-12 pt-6 ml-10">
        {postTitle}
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full lg:w-7/12 lg:mt-2 mt-2 lg:ml-4">
          <QandABody post={data} />
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
}
