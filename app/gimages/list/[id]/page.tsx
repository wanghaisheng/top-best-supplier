import { getListById } from "@/app/lib/repo/lists_repo";
import { getTopic } from "@/app/lib/repo/topics_repo";
import {
  base_images_url,
  checkImageValidity,
  isNull,
} from "@/app/utils/custom_helpers";
import Image from "next/image";

export default async function TopicImage({
  params,
}: {
  params: { id: string };
}) {
  try {
    let listData: any = {};

    let title: any = "";

    const listResult = await getListById(params.id.replace(".png", ""));

    if (listResult) {
      listData = listResult;
    }

    if (isNull(listResult)) {
      return { success: false, msg: "not found" };
    }

    let data: any = {};

    const result = await getTopic(
      listData.topicData.slug.replace(".png", "10"),
      10
    );

    if (result) {
      data = result;
    }

    let listImages: any[] = [];
    const ex_check = await checkImageValidity(listData.external_image);
    if (!isNull(listData.external_image) && ex_check.success != false) {
      listImages.push(listData.external_image);
    }

    if (!isNull(listData.all_images)) {
      const jsonData = "[" + listData.all_images.slice(1, -1) + "]";
      const urlsArray = JSON.parse(jsonData);

      let list_n = 0;
      for (let i = 0; i < urlsArray.length; i++) {
        const ex_check = await checkImageValidity(urlsArray[i]);
        if (ex_check.success != false && list_n <= 6) {
          listImages.push(urlsArray[i]);
          list_n++;
        }
      }
    }

    let lists: any = [];
    let listIndex = "1";

    if (data.lists && data.lists.result) {
      data.lists.result.map((l, i) => {
        if (l.title === listData.title) {
          listIndex = i + 1;
        }
        lists.push({ title: l.title });
      });
    }

    const heights = [
      /* "h-96",
    "h-80",
    "h-72",
    "h-64",*/
      "h-60",
      "h-56",
      "h-52",
      "h-48",
      "h-44",
      "h-40",
      "h-36",
      "h-32",
      "h-28",
      "h-24",
      "h-20",
      "h-16",
      "h-14",
      "h-12",
      "h-11",
      "h-10",
      "h-9",
      "h-8",
      "h-7",
      "h-6",
      "h-5",
      "h-4",
      "h-3.5",
      "h-3",
      "h-2.5",
      "h-2",
      "h-1.5",
      "h-1",
    ];

    return (
      <div
        className="border-4 border-red-700"
        style={{
          height: "100vh", // Use 100vh for full viewport height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            backgroundImage: `url(${base_images_url("grid.svg")})`,
            backgroundPosition: "center",
            maskImage: "linear-gradient(180deg, white, rgba(255, 255, 255, 0))",
          }}
        ></div>

        <div className="flex min-h-[calc(100vh-2rem)] flex-col">
          <div className="flex justify-center text-center font-extrabold text-6xl text-blue-900 m-5">
            {listData.title} - topingnow.com
          </div>
          <div className="flex border-t-4 border-red-500"></div>

          <div className="flex justify-center text-center items-center font-extrabold text-3xl text-blue-900 m-1">
            <span className="text-green-900">
              {listData.title} is Number {listData.position} in{" "}
              {listData.topicData.title}
            </span>
          </div>
          <div className="flex justify-center text-center items-center m-1">
            <img
              src={`/images/arrow_point.png`}
              alt={""}
              width={60}
              height={60}
              className="rounded-sm object-cover"
            />
          </div>
          {listData.position == 1 ? (
            <div className="flex justify-center items-center m-10  border-3 border-green-600">
              <div className="bg-transparent text-white rounded-full w-20 h-20 flex items-center justify-center">
                <img
                  src={base_images_url("top_1.png")}
                  alt=""
                  width={150}
                  height={150}
                  tw="flex rounded-sm"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center m-20">
              <div className="bg-red-800 text-white rounded-full w-20 h-20 flex items-center justify-center">
                <span className="text-center font-extrabold text-2xl">
                  TOP {listData.position}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-end flex-grow">
            {listImages.map((post, i) => {
              const length = lists.length + "0";
              if (i <= 20) {
                return (
                  <div
                    key={i}
                    className={`relative h-60 w-${2000 / listImages.length}`}
                  >
                    <img
                      className="object-cover w-full h-full"
                      src={post}
                      alt=""
                    />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
}
