import Topics from "@/app/posts/topics";
import Layout from "./[slug]/layout";
import { NEXT_PUBLIC_GET_TOPS } from "@/constants";
import Shimmer from "./components/shimmer";
import { getTop, getTops } from "./lib/repo/tops_repo";
import Image from "next/image";
import ExtSearchScreen from "./components/ext_search_screen";

export const revalidate = parseInt(
  String(process.env.NEXT_PUBLIC_RE_VALIDATE),
  10
);

export default async function Page() {
  const perPage = 5;
  const page = 1;

  const url = `${NEXT_PUBLIC_GET_TOPS}`;
  let data: any = [];

  const res = await getTops();

  if (res) {
    data = res.result;
  }

  return (
    <Layout>
      <div className="bg-gray-100">
        <div
          className="h-96 p-2 border-b border-gray-300"
          style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            alignItems: "start",
            justifyContent: "start",
            backgroundImage: `url("${process.env.NEXT_PUBLIC_BASE_URL}/images/beams.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_URL}/images/grid.svg)`,
              backgroundPosition: "center",
              maskImage:
                "linear-gradient(180deg, white, rgba(255, 255, 255, 0))",
              pointerEvents: "none",
            }}
          ></div>

          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col w-full lg:w-[60%]">
              <div className="flex font-bold text-1xl lg:text-3xl text-blue-900">
                Nothing But Top Best in Everything around the world
              </div>
              <div className="pt-5 pb-10 text-lg">
                Search, find and decide on a service provider in record time.
                Read verified reviews from real business leaders just like you.
                Browse all vetted businesses worldwide
              </div>
              <div className="mt-0">
                <ExtSearchScreen />
              </div>
            </div>
            <div className="hidden lg:block  flex-col w-[20%]">
              <div className="flex rounded-full overflow-hidden border-4 border-white w-60 h-60">
                <Image
                  className="flex w-full h-full object-cover"
                  src={"/images/happy-colleagues.png"}
                  alt={"Top"}
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="p-2 lg:p-10">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {data &&
                data.map(({ title, _id, extraClass, topTopics }, i) => {
                  if (
                    topTopics &&
                    topTopics.result &&
                    topTopics.result.length > 0
                  ) {
                    return (
                      <article
                        key={_id}
                        className="flex max-w-xl flex-col items-start justify-between"
                      >
                        <div className="relative bg-white pb-3 w-full shadow-xl ring-1 ring-gray-900/5 rounded">
                          <div
                            className={`${extraClass} bg-gray-500 flex items-center justify-center gap-x-4 px-4 py-2 text-xs font-bold text-center text-white rounded-tr rounded-tl`}
                          >
                            Top {title} Best all over the world
                          </div>
                          <div className="group relative pt-2 space-y-2 py-2 px-2 text-base text-gray-600">
                            <div className="mt-1 line-clamp-3 text-sm leading-6 text-gray-600">
                              <Topics topId={_id} topicData={data[i]} />
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
