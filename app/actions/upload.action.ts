"use server";

import { revalidatePath } from "next/cache";
import AdmZip from "adm-zip";
import { uploadToR2 } from "@/lib/r2";
import { createClient } from "@/lib/supabase/server";
import path from "path";

type UploadFormState = {
  error?: string;
  success?: boolean;
  uploadedCount?: number;
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

export async function uploadZipFile(
  prevState: UploadFormState | undefined,
  formData: FormData
): Promise<UploadFormState> {
  try {
    const name = formData.get("name") as string;
    const file = formData.get("zipFile") as File;
    const selectedTags = formData.getAll("tags") as string[];

    if (!name || name.trim().length === 0) {
      return { error: "Name is required" };
    }

    if (!file || file.size === 0) {
      return { error: "Please select a ZIP file" };
    }

    if (!file.name.endsWith(".zip")) {
      return { error: "Only ZIP files are allowed" };
    }

    if (selectedTags.length === 0) {
      return { error: "Please select at least one tag" };
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: "File size must be less than 50MB" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();

    const imageEntries = zipEntries.filter((entry) => {
      if (entry.isDirectory) return false;
      const ext = path.extname(entry.entryName).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });

    if (imageEntries.length === 0) {
      return { error: "No image files found in the ZIP archive" };
    }

    const supabase = createClient();
    let uploadedCount = 0;

    // First, create a gallery
    const { data: gallery, error: galleryError } = await supabase
      .from("galleries")
      .insert({
        name: name.trim(),
      })
      .select()
      .single();

    if (galleryError || !gallery) {
      return { error: "Failed to create gallery: " + galleryError?.message };
    }

    // Link gallery to tags
    const galleryTagInserts = selectedTags.map((tagId) => ({
      gallery_id: gallery.id,
      tag_id: parseInt(tagId),
    }));

    const { error: tagLinkError } = await supabase
      .from("gallery_tags")
      .insert(galleryTagInserts);

    if (tagLinkError) {
      console.error("Error linking tags to gallery:", tagLinkError);
    }

    // Process each image
    for (const entry of imageEntries) {
      try {
        const fileBuffer = entry.getData();
        const fileName = path.basename(entry.entryName);
        const ext = path.extname(fileName).toLowerCase();
        
        // Determine content type
        const contentTypeMap: Record<string, string> = {
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".png": "image/png",
          ".gif": "image/gif",
          ".webp": "image/webp",
          ".svg": "image/svg+xml",
        };
        const contentType = contentTypeMap[ext] || "application/octet-stream";

        // Upload to R2 with gallery-specific folder
        const folderPath = `gallery-${gallery.id}`;
        const imageUrl = await uploadToR2(fileBuffer, fileName, contentType, folderPath);

        // Save to Supabase database with gallery_id
        const { error: dbError } = await supabase.from("images").insert({
          gallery_id: gallery.id,
          name: fileName,
          url: imageUrl,
          size: fileBuffer.length,
          content_type: contentType,
        });

        if (dbError) {
          console.error("Error saving image to database:", dbError);
          continue;
        }

        uploadedCount++;
      } catch (err) {
        console.error(`Error processing ${entry.entryName}:`, err);
      }
    }

    if (uploadedCount === 0) {
      return { error: "Failed to upload any images" };
    }

    revalidatePath("/upload");
    return { 
      success: true, 
      uploadedCount,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload file: " + (error as Error).message };
  }
}
