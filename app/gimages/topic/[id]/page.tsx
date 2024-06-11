import { getTopic } from "@/app/lib/repo/topics_repo";
import { isNull } from "@/app/utils/custom_helpers";

export default async function TopicImage({
  params,
}: {
  params: { id: string };
}) {
  let data: any = {};
  const result = await getTopic(params.id.replace(".png", ""), 10);

  if (result) {
    data = result;
  }

  if (isNull(result)) {
    return { success: false, msg: "not found" };
  }

  let lists: any = [];

  if (data.lists && data.lists.result) {
    data.lists.result.map((l, i) => {
      lists.push({ title: l.title });
    });
  }

  const heights = [
    "h-96",
    "h-80",
    "h-72",
    "h-64",
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
          backgroundImage: "url(http://localhost:3000/images/grid.svg)",
          backgroundPosition: "center",
          maskImage: "linear-gradient(180deg, white, rgba(255, 255, 255, 0))",
        }}
      ></div>

      <div className="flex h-screen flex-col">
        <div className="flex justify-center text-center font-extrabold text-6xl text-blue-900 m-5">
          {data.title ?? ""}
        </div>
        <div className="flex border-t-4 border-red-500"></div>

        <div className="flex justify-center text-center items-center font-extrabold text-3xl text-blue-900 m-1">
          {lists[0] && lists[0].title
            ? `${lists[0].title} is the Overral Best`
            : "no list yet"}
          <img
            src={`/images/top_1.png`}
            alt={""}
            width={100}
            height={100}
            className=" rounded-sm object-cover"
          />
        </div>
        <div className="flex justify-center text-center items-center m-1">
          <img
            src={`/images/arrow_point.png`}
            alt={""}
            width={60}
            height={60}
            className=" rounded-sm object-cover"
          />
        </div>
        <div className="flex items-end flex-grow">
          {lists.map((post, i) => {
            const height = heights[i];
            let rate = height.replace("h-", "");
            if (rate === "96") {
              rate = "100";
            }

            const d = 400 / lists.length;
            let w = heights.length - lists.length + d;

            if (heights.length > i) {
              return (
                <div className="flex flex-col" key={i}>
                  <div
                    className={`m-2 rounded p-2 flex text-black font-bold items-end w-20 overflow-hidden`}
                  >
                    <div className="overflow-hidden flex text-sm">{rate}%</div>
                  </div>
                  <div
                    className={`${height} bg-blue-600 m-2 rounded p-2 shadow-xl  flex text-white font-bold items-end w-20 overflow-hidden`}
                  >
                    <div className="overflow-hidden flex text-sm">
                      {post.title}
                    </div>
                  </div>
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
}
