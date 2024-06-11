import { ImageResponse } from "next/og";
import {
  base_images_url,
  base_url,
  checkImageValidity,
  isNull,
} from "@/app/utils/custom_helpers";
import { getTopic } from "@/app/roadmap/topics_roadmap";
import { getListById } from "@/app/lib/repo/lists_repo";

export const dynamic = "force-dynamic";

export async function ListImageGen(id: any) {
  try {
    const topicSlug = id.replace(".png", "");
    const page = 1;
    let result = await getListById(topicSlug);

    let data: any = null;
    if (result) {
      data = result;
    }

    if (isNull(data)) {
      return new ImageResponse(await CustomImageResponse(), {
        width: 1920,
        height: 1080,
      });
    }

    let lists: any[] = [];
    const ex_check = await checkImageValidity(data.external_image);
    if (!isNull(data.external_image) && ex_check.success != false) {
      lists.push(data.external_image);
    }

    if (!isNull(data.all_images)) {
      const jsonData = "[" + data.all_images.slice(1, -1) + "]";
      const urlsArray = JSON.parse(jsonData);

      let list_n = 0;
      for (let i = 0; i < urlsArray.length; i++) {
        const ex_check = await checkImageValidity(urlsArray[i]);
        if (ex_check.success != false && list_n <= 6) {
          lists.push(urlsArray[i]);
          list_n++;
        }
      }
    }

    return new ImageResponse(
      (
        <div
          tw="w-full border-4 border-red-500"
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${base_images_url("beams-with.png")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div tw="flex h-screen flex-col">
            <div
              tw="flex justify-center text-center font-extrabold text-6xl text-blue-900 m-5 pt-20 mb-20"
              style={{
                fontWeight: "bolder",
                fontSize: "3rem",
                textAlign: "center",
                color: "#1e40af",
              }}
            >
              {data.title} is Number {data.position}
            </div>
            <div tw="flex border-t-4 border-red-500 mt-2 mb-2 pt-2 pb-2"></div>

            <div tw="flex justify-center text-center items-center font-extrabold text-3xl text-blue-900 mb-20">
              <div
                tw="flex"
                style={{
                  fontWeight: "bolder",
                  fontSize: "2rem",
                  textAlign: "center",
                  color: "#1e40af",
                }}
              >
                {data.topicData.title ?? ""} by Topingnow.com
              </div>
            </div>
            <span tw="flex items-end">
              {shuffleArray(lists).map((post, i) => {
                const length = lists.length + "0";
                if (i <= 6) {
                  return (
                    <div tw="flex flex-col" key={i}>
                      <img
                        src={post}
                        height={350}
                        width={2000 / lists.length}
                      />
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </span>
            <div tw="flex items-end">
              {shuffleArray(lists).map((post, i) => {
                const length = lists.length + "0";
                if (i <= 24) {
                  return (
                    <div tw="flex flex-col" key={i}>
                      <img
                        src={post}
                        height={350}
                        width={2000 / lists.length}
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
      ),
      {
        width: 1920,
        height: 1080,
      }
    );
  } catch (e) {
    console.error(e.stack || e);
    return new ImageResponse(await CustomImageResponse(), {
      width: 1920,
      height: 1080,
      status: 400,
    });
  }
}

export async function CustomImageResponse() {
  const data = {
    title: "Coming Soon",
    backgroundImage: base_images_url("beams-with.png"),
    topImage: base_images_url("top_1.png"),
    arrowImage: base_images_url("arrow_point.png"),
  };

  return (
    <div
      tw="w-full"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${data.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div tw="flex h-screen flex-col">
        <div tw="flex justify-center text-center font-extrabold text-6xl text-blue-900 m-5">
          {data.title}
        </div>
        <div tw="flex border-t-4 border-red-500"></div>

        <div tw="flex justify-center text-center items-center font-extrabold text-3xl text-blue-900 m-1">
          <div tw="flex">coming</div>
          <img
            src={data.topImage}
            alt=""
            width={100}
            height={100}
            tw="flex rounded-sm"
          />
        </div>
        <div tw="flex justify-center text-center items-center m-1">
          <img
            src={data.arrowImage}
            alt=""
            width={60}
            height={60}
            tw="flex rounded-sm"
          />
        </div>
        <div tw="flex items-end flex-grow">coming now</div>
      </div>
    </div>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
