export default function Shimmer(length: number) {
  return Array.from({ length }, (_, i) => ({
    _id: i + 1,
    title: "\u00A0".repeat(2),
    name: "\u00A0".repeat(2),
    slug: "#",
    postSlug: "#",
    body: [],
    topTopics: {},
    extraClass: "bg-gray-200 animate-pulse px-2 w-full text-transparent",
  }));
}

export function SingleShimmer(repeat: number) {
  return {
    _id: "1",
    title: "\u00A0".repeat(2),
    name: "\u00A0".repeat(2),
    description: "\u00A0".repeat(100),
    slug: "#",
    lists: [],
    topicTop: {},
    body: [],
    extraClass: "bg-gray-200 animate-pulse px-2 py-2.5 w-full text-transparent",
  };
}
