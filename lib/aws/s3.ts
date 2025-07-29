//next we have to add remove the product in your products and change the ui

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(fileBuffer: Buffer, fileType: string) {
  const fileName = `${uuidv4()}.${fileType.split("/")[1]}`;
  const bucket = process.env.AWS_S3_BUCKET!;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,
   // ACL: "public-read", // Make file public
  });

  await s3.send(command);

  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}
