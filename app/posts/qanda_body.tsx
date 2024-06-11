import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import { getS3Url } from "../lib/repo/files_repo";
import StepsBody from "./steps_body";

export default function QandABody({ post }) {
  if (!post) {
    return <>loading..</>;
  }

  const { title, description, featuredImagePath, body, steps } = post;

  const postBody = JSON.parse(body);
  const postSteps = JSON.parse(steps);

  let postTitle = title;

  postTitle = `${title}`;

  return (
    <div className="relative flex sm:py-7">
      <div className="relative px-1 pb-2 pt-2 sm:mx-auto w-full sm:px-2">
        <div className="relative bg-white p-2 shadow-xl ring-1 ring-gray-900/5 mb-10 rounded-md">
          {featuredImagePath && (
            <div className="h-200">
              <Image
                src={getS3Url(featuredImagePath)}
                alt={postTitle}
                style={{ width: "100%" }}
                width={200}
                height={200}
                className="w-full rounded-sm object-cover"
                priority
              />
            </div>
          )}
          <div className="pt-1">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(postBody[0].dataBody),
              }}
            />
          </div>
        </div>
        {Array.isArray(postSteps) && <StepsBody postSteps={postSteps} />}
      </div>
    </div>
  );
}
