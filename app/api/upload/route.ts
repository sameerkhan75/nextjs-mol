// app/api/upload/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/lib/aws/s3";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadFileToS3(buffer, file.type);

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("S3 upload error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
