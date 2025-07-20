import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(
      file.name,
      file.stream(),
      { access: 'public' }
    );
//will do this later
/* npx vercel login
npx vercel tokens list
# or
npx vercel tokens ls
npx vercel tokens create
*/
    return NextResponse.json({ url: blob.url });
  } catch (err: unknown) {
    console.error('Image upload error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
