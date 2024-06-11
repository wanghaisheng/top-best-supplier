"use server";

const fetcher = async (url: any) => {
  const { searchParams } = new URL(url);
  const cache = searchParams.get("cache") ?? "yes";
  const revalidateIfNeeded =
    cache === "yes" ? process.env.NEXT_PUBLIC_RE_VALIDATE : 0;
  if (process.env.NODE_ENV === "test") {
    console.log(url);
  }
  const res = await fetch(url, {
    next: {
      revalidate: parseInt(String(revalidateIfNeeded), 10),
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};
export default fetcher;
