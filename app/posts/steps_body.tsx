import React from "react";
import Image from "next/image";
import { getS3Url } from "../lib/repo/files_repo";
import DOMPurify from "isomorphic-dompurify";

export default function StepsBody({ postSteps }) {
  return (
    <div>
      <ul>
        {postSteps.map(
          (
            { dataBody, slug, featuredImagePath, step, position }: any,
            index: number
          ) => (
            <li key={slug} id={slug}>
              <article className="relative bg-white pb-3 w-full shadow-xl ring-1 ring-gray-900/5 mb-10 rounded">
                <div
                  className={` bg-gray-500 flex items-left justify-left gap-x-4 px-2 py-2 text-xs font-bold text-left text-white`}
                >
                  Step {position}: {step}
                </div>
                {featuredImagePath && (
                  <div className="mb-1">
                    <Image
                      src={getS3Url(featuredImagePath)}
                      alt={step}
                      style={{ width: "100%" }}
                      width={500}
                      height={200}
                      className="w-full rounded-sm object-cover"
                      priority
                    />
                  </div>
                )}
                <div className="group relative pt-2 space-y-2 py-2 px-2 text-base text-gray-600">
                  <div
                    className={`mt-2 line-clamp-3 text-sm leading-6 text-gray-600`}
                  >
                    {dataBody ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(dataBody),
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </article>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
