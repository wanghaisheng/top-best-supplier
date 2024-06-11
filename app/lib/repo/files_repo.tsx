import { s3Client } from "@/app/utils/aws";
import { isNull } from "@/app/utils/custom_helpers";
import {
  NEXT_PUBLIC_GET_FILES,
  NEXT_PUBLIC_POST_FILES,
  NEXT_PUBLIC_S3_UPLOADER,
} from "@/constants";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import https from "https";
import http from "http";
import { customSlugify } from "@/app/utils/custom_slugify";
import axios from "axios";

export async function postFiles(tData: any) {
  try {
    const url = `${NEXT_PUBLIC_POST_FILES}`;

    let formData = new FormData();
    formData.append("postData", JSON.stringify(tData));

    const result = await fetch(url, {
      cache: "no-store",
      method: "POST",
      body: formData,
    });

    if (result.status === 200) {
      return await result.json();
    } else {
      return { error: "Failed to fetch topic", success: false };
    }
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while posting topics", success: false };
  }
}

export async function uploadToS3FromUrl(imageUrl: string, path: string) {
  let retryCount = 0;
  let maxRetries = 3; // Maximum number of retries

  while (retryCount < maxRetries) {
    try {
      const imageResponse = await axios.get(imageUrl, {
        responseType: "stream",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      // Prepare image data
      const imageStream = imageResponse.data;
      const file = await streamToBuffer(imageStream);

      const res = await uploadFileToS3(file, path, "image/png");

      if (res.success) {
        maxRetries = 0;
      }

      return { success: res.success, path: res.path };
    } catch (error) {
      console.error(error);
      if (error.code === "ECONNRESET" && retryCount < maxRetries - 1) {
        console.log(
          `Retrying fetch to ${imageUrl} (${retryCount + 1}/${maxRetries})...`
        );
        retryCount++;
      } else {
        return { success: false, path: imageUrl };
      }
    }
  }
}

async function uploadFileToS3(file, path, type) {
  try {
    const fileBuffer = file;
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      Key: path,
      Body: fileBuffer,
      ContentType: type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    return { path: path, success: true };
  } catch (e) {
    return { success: false, msg: e };
  }
}

// Helper function to convert stream to buffer
async function streamToBuffer(stream) {
  try {
    return new Promise((resolve, reject) => {
      const chunks: any = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", (error) => reject(error));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  } catch (e) {
    console.error(e);
  }
}

export const getS3Url = (path: any) => {
  if (isNull(path) || path == "undefined/undefined" || path == "/") {
    const s3FileUrl = `/images/placeholder.png`;
    return s3FileUrl;
  }
  const s3FileUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${path}`;
  return s3FileUrl;
};

export async function getFiles(page: string, perPage: string) {
  try {
    const url = `${NEXT_PUBLIC_GET_FILES}?page=${page}&perPage=${perPage}`;

    const res = await fetch(url, {
      next: {
        revalidate: parseInt(process.env.NEXT_PUBLIC_RE_VALIDATE as string, 10),
      },
    });

    if (!res.ok) {
      console.log("Fetch failed");
      return { error: res.statusText };
    }

    const result = await res.json();
    const { data } = result;

    return data;
  } catch (error) {
    console.error(error);

    return {
      error: error.message || "Failed to fetch files",
    };
  }
}
