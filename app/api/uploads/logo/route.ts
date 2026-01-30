import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const bucket = process.env.SUPABASE_BUCKET_LOGOS;
    if (!bucket) throw new Error("SUPABASE_BUCKET_LOGOS is not configured");

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const maxBytes = 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 3MB)" }, { status: 400 });
    }

    const allowed = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const extFromType: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
      "image/svg+xml": "svg",
    };

    const ext = extFromType[file.type] ?? "bin";
    const path = `logos/${crypto.randomUUID()}.${ext}`;

    const supabase = getSupabaseServerClient();
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ path, url: data.publicUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload error" }, { status: 500 });
  }
}
