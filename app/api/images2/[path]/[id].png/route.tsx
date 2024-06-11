import fs from "fs/promises";
import puppeteer from "puppeteer";

export async function GET(
  request: any,
  { params }: { params: { path: string; id: string } }
) {
  process.env.PUPPETEER_CACHE_DIR = "./cache/puppeteer";
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  const newHeaders = new Headers(request.headers);

  let pageCookies: any = [];
  try {
    const cookiesFile = await fs.readFile("cookies.json", "utf8");
    pageCookies = JSON.parse(cookiesFile);
  } catch (error) {
    console.error("Error reading cookies file:", error);
  }

  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  await page.setCookie(...pageCookies);

  await page.goto(
    `${process.env.NEXT_PUBLIC_BASE_URL}/gimages/${params.path}/${params.id}`,
    {
      waitUntil: "networkidle0",
    }
  );

  await page.evaluate(() => {
    const style = document.createElement("style");
    style.innerHTML = `* { transition: none !important; animation: none !important; }`;
    document.head.appendChild(style);
  });

  const buffer = await page.screenshot({
    omitBackground: true,
    fullPage: true,
  });

  const finalCookies = await page.cookies();

  // Combine the initially captured cookies and the final cookies
  pageCookies.push(...finalCookies);

  const serializedCookies = JSON.stringify(pageCookies);
  await fs.writeFile("cookies.json", serializedCookies, "utf8");

  await browser.close();
  newHeaders.set("Content-Type", "image/png");
  return new Response(buffer);
}
