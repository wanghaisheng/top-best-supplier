import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { FileModel } from "@/app/models/file_model";
import { postFiles } from "@/app/lib/repo/files_repo";
import { cleanFileName } from "@/app/utils/custom_helpers";
import { customSlugify } from "@/app/utils/custom_slugify";
import { s3Client } from "@/app/utils/aws";

async function uploadFileToS3(file, fileName, type) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
    Key: `uploads/${fileName}`,
    Body: fileBuffer,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    console.log(file);

    if (!file) {
      return NextResponse.json({ msg: "file is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(
      buffer,
      customSlugify(file.name),
      file.type
    );

    const fileData: FileModel[] = [];

    fileData.push({
      title: cleanFileName(file.name),
      slug: customSlugify(file.name),
      provider: "AWS-S3",
      path: "uploads",
      type: file.type,
      size: file.size,
    });

    await postFiles(fileData);

    return NextResponse.json({ success: true, fileName: fileName });
  } catch (error) {
    return NextResponse.json({
      msg: `error uploading file ${error.stack || error}`,
    });
  }
}
