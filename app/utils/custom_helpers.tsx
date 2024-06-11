import { toast } from "sonner";
import { getTemplate } from "../lib/repo/templates_repo";
import { placeholders } from "./templates";
import { customSlugify } from "./custom_slugify";
import { unidecode } from "unidecode";

const textToHtml = (text: any) => {
  const elem = document.createElement("div");
  return text
    .split(/\n\n+/)
    .map((paragraph) => {
      return (
        "<p>" +
        paragraph
          .split(/\n+/)
          .map((line) => {
            elem.textContent = line;
            return elem.innerHTML;
          })
          .join("<br/>") +
        "</p>"
      );
    })
    .join("");
};
export default textToHtml;

export function isNull(text: any) {
  if (
    text === undefined ||
    text === null ||
    text === "" ||
    !text ||
    text === "not_found" ||
    text === "[]" ||
    text === "{}" ||
    text === "/" ||
    text === "NaN" ||
    text === "undefined/undefined" ||
    text === "undefined/" ||
    text === "/undefined" ||
    text === false ||
    text === 0 ||
    text.length === 0 ||
    Object.keys(String(text)).length === 0
  ) {
    return true;
  }
  return false;
}

export function byDemo() {
  const isDemo = true;

  const words = [
    "apple",
    "banana",
    "chocolate",
    "dragon",
    "elephant",
    "flamingo",
    "guitar",
    "happiness",
    "internet",
    "jazz",
    // Add more words as needed
  ];

  const randomWordsList = Array.from({ length: 3 }, () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const newWord = words[randomIndex];
    return newWord;
  });

  const result = randomWordsList.join(" ");

  const res = isDemo ? result : "";

  return res;
}

export function defaultProcess(text, type = "none") {
  let output;
  try {
    output = text;
    if (!isNull(text)) {
      Object.keys(placeholders).forEach((placeholder) => {
        try {
          output = output.replace(
            new RegExp(placeholder, "g"),
            placeholders[placeholder]
          );
        } catch (error) {
          console.error(error);
        }
      });
    }
  } catch (error) {
    console.error(error);
    output = text;
  }

  return output;
}

export async function dataProcess(text, type = "none", iniData = {}) {
  try {
    let data: any = iniData;

    if (text && text.steps && Array.isArray(JSON.parse(text.steps))) {
      data.steps =
        JSON.parse(text.steps).length > 0 ? JSON.parse(text.steps).length : 1;
    }

    //for title
    if (!isNull(text.title)) {
      text.title = await tProcess(text.title, type, data);
    }

    if (!isNull(text.description)) {
      text.description = await tProcess(text.description, type, data);
    }

    if (!isNull(text.dataBody)) {
      text.dataBody = await tProcess(text.dataBody, type, data);
    }

    //for question and answer
  } catch (error) {
    console.error(error);
  }

  return text;
}

export async function tProcess(text, type = "none", data) {
  if (!isNull(text)) {
    text = await defaultProcess(text, type);

    const regex = /\{([^}]*)\}/g; // Match words within curly braces

    const matches = text.matchAll(regex);

    const extractedWords: string[] = []; // Explicitly declare extractedWords as a string array

    if (matches) {
      for (const match of matches) {
        const matchStr: string = match[1]; // Explicitly type matchStr as string
        extractedWords.push(`{${matchStr}}`);
      }
    }

    const temps = await Promise.all(extractedWords.map(getTemplate));

    let description = text;

    for (let i = 0; i < extractedWords.length; i++) {
      if (extractedWords[i] === "{top}" && data.top) {
        description = description.replace(extractedWords[i], data.top);
      }

      if (extractedWords[i] === "{topic}" && data.topic) {
        description = description.replace(extractedWords[i], data.topic);
      }

      if (extractedWords[i] === "{steps}" && data.steps) {
        description = description.replace(
          extractedWords[i],
          data.steps === 1 ? `${data.steps} Step` : `${data.steps} Steps`
        );
      }

      if (temps[i] != "not_found") {
        const { title, body } = temps[i];
        const bodyD = JSON.parse(body);
        description = description.replace(
          title,
          await getRandomDataBody(bodyD)
        );
      } else {
        description = description.replace(
          extractedWords[i],
          `${extractedWords[i]}{n_f}`
        );
      }
    }

    text = description;
  }

  return text;
}

export function removeById(data, id) {
  return data.filter((item) => item._id !== id);
}

export function dataToast(success, msg) {
  if (success == true) {
    return toast.success(`${msg}`);
  } else {
    return toast.error(`${msg}`);
  }
}

async function getRandomDataBody(body) {
  const randIndex = Math.floor(Math.random() * body.length);
  return body[randIndex].dataBody;
}

export function stripeNone(data) {
  if (data == "None") {
    return "";
  }
}

export const extractDomain = (url) => {
  url = url ? url : "";
  // Regular expression to match the domain name
  const domainRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/;
  const match = url.match(domainRegex);
  return match ? match[1] : ""; // Return the first capturing group
};

export function getViewUrl(slug, type = "") {
  const path = slug ? "/" + slug : "";

  return `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;
}
export function stripHtmlTags(html) {
  if (html) {
    if (typeof html !== "string") {
      throw new Error("Expected a string");
    }

    return html.replace(/<[^>]*>?/gm, "");
  } else {
    return html;
  }
}

export function countWords(textContent) {
  const words = textContent.trim().split(/\s+/);
  return words.length;
}

export function base_url(slug = "") {
  if (isNull(slug)) {
    return String(process.env.NEXT_PUBLIC_BASE_URL);
  } else {
    return String(`${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`);
  }
}

export function get_list_url(data) {
  if (!isNull(data)) {
    return base_url(`${data.topicData.slug}/${data.slug}`);
  } else {
    return base_url();
  }
}

export function base_images_url(slug = "") {
  if (isNull(slug)) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/images/${slug}`;
  } else {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/images/${slug}`;
  }
}

export function cleanFileName(filename) {
  // Create temp file name
  let cleanName = filename;

  if (filename) {
    // Remove file extension
    cleanName = cleanName.split(".").slice(0, -1).join(".");

    // Replace dashes and underscores with spaces
    cleanName = cleanName.replace(/[-_]/g, " ");

    // Remove non-alphanumeric characters
    cleanName = cleanName.replace(/[^A-Za-z0-9]/g, " ");

    // Replace double spaces with single spaces
    cleanName = cleanName.replace(/\s\s+/g, " ");
  }

  // Return cleaned file name
  return cleanName.trim();
}

export async function preFetch(url: any) {
  await fetch(url),
    {
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    };
  return url;
}

export function beforeImport(data, requiredFields) {
  const missingFields = requiredFields.filter((field) => !data[0][field]);

  if (missingFields.length > 0) {
    return missingFields.map((field) => {
      return `${field} field is required`;
    });
  }

  return true;
}

export function beforePost(data) {
  const requiredFields = Object.keys(data);

  let errors: string[] = [];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(`${field} is required`);
    }
  });

  if (errors.length) {
    errors.forEach((err) => toast.error(err));
    return false;
  }

  return true;
}

export function beforeInsert(updateData) {
  if (isNull(updateData._id)) {
    delete updateData._id;
  }

  return updateData;
}

export function beforeUpdatePend(updateData, uData) {
  for (const key in updateData) {
    if (!isNull(updateData[key])) {
      uData[key] = updateData[key];
    }
  }

  uData._id = "";
  uData.updatedAt = new Date();

  return uData;
}

export function beforeUpdate(updateData, uData) {
  for (const key in updateData) {
    if (!isNull(String(updateData[key]))) {
      uData[key] = updateData[key];
    } else {
      delete uData[key];
    }
  }

  delete uData._id;

  uData.updatedAt = new Date();

  return uData;
}

export async function processInner(temp, type) {
  const steps = JSON.parse(temp.steps);
  temp = await dataProcess(temp, "qanda", { steps: steps.length });

  if (temp.body) {
    const bodies = JSON.parse(temp.body);
    const tBody: any = [];
    for (let i = 0; i < bodies.length; i++) {
      const { dataBody } = await dataProcess(
        { dataBody: bodies[i].dataBody },
        "qanda",
        { steps: steps.length }
      );
      tBody.push({ dataBody: dataBody });
    }
    temp.body = JSON.stringify(tBody);
  }

  if (temp.steps) {
    const steps = JSON.parse(temp.steps);
    const tSteps: any = [];
    for (let i = 0; i < steps.length; i++) {
      const { dataBody, step, position, slug } = await dataProcess(
        {
          dataBody: steps[i].dataBody,
          step: steps[i].step,
          position: steps[i].position,
          slug: steps[i].slug,
        },
        "qanda",
        { steps: steps.length }
      );
      tSteps.push({ dataBody, step, position, slug });
    }

    temp.steps = JSON.stringify(tSteps);
  }

  return temp;
}

export function construct_sitemap(type, id = 1) {
  const isProduction = process.env.NODE_ENV === "production";
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  let link = "";

  if (isProduction) {
    link = `${BASE_URL}/sitemap/${type}/all/sitemap/${id}.xml`;
  } else {
    link = `${BASE_URL}/sitemap/${type}/all/sitemap.xml/${id}`;
  }

  return link;
}

export function extractNumber(str) {
  const match = str.match(/\d+/);
  if (match) {
    return match[0];
  }
  return null;
}

// utils/slugUtils.js

export function removeNonEnglishCharacters(slug: any) {
  try {
    if (!isNull(slug)) {
      const cleanedSlug = slug
        .replace(/[^a-zA-Z0-9-]/g, "")
        .split("-")
        .join(" ");
      return unidecode(cleanedSlug);
    } else {
      return slug;
    }
  } catch (e) {
    console.error(e);
    return slug;
  }
}

export function generateBreadcrumb(data: any) {
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
      "@id": String(base_url()),
      name: "Top",
    },
  });

  data.map((result: any, i) => {
    breadcrumb.push({
      "@type": "ListItem",
      position: String(i + 2),
      item: {
        "@id": result.url,
        name: result.title,
      },
    });
  });

  return breadcrumb;
}

export async function checkImageValidity(imageUrl, maxRetries = 2) {
  try {
    if (isNull(imageUrl)) {
      return { success: false };
    }

    let retryCount = 0;
    while (retryCount < maxRetries) {
      const response = await fetch(imageUrl);
      if (response.ok) {
        return imageUrl; // Image link is valid
      } else {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
      }
    }

    return { success: false }; // Image link is not valid after retrying
  } catch (error) {
    console.error(
      `Error checking image validity for ${imageUrl}:`,
      error.stack || error
    );
    return { success: false };
  }
}

export const modifyImageUrl = (url, w = 500, h = 500) => {
  try {
    if (!isNull(url)) {
      const pattern = /(?:&|\?)w=(\d+)&h=(\d+)/;
      const match = url.match(pattern);

      let finalurl = url;
      if (match) {
        const [, wPart, hPart] = match;
        const newWH = `w=${w}&h=${h}`;
        finalurl = url.replace(`w=${wPart}&h=${hPart}`, newWH);
      } else {
        // If the pattern is not found, add the resizing parameters to the URL
        const separator = url.includes("?") ? "&" : "?";
        finalurl = `${url}${separator}w=${w}&h=${h}`;
      }
      return finalurl;
    } else {
      return url;
    }
  } catch (e) {
    console.log(e);
    return url;
  }
};
