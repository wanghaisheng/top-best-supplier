import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
