import { createClient } from "@/lib/supabase/server";
import GalleryViewer from "@/components/gallery-viewer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createClient();

  // Fetch gallery details
  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("*")
    .eq("id", id)
    .single();

  if (galleryError || !gallery) {
    notFound();
  }

  // Fetch gallery tags
  const { data: galleryTags } = await supabase
    .from("gallery_tags")
    .select(`
      tags (
        id,
        name
      )
    `)
    .eq("gallery_id", id);

  const tags = galleryTags?.map((gt: any) => gt.tags) || [];

  // Fetch all images for this gallery
  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("*")
    .eq("gallery_id", id)
    .order("created_at", { ascending: true });

  if (imagesError) {
    console.error("Error fetching images:", imagesError);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Galleries
          </Link>
        </Button>
      </div>

      <GalleryViewer
        galleryName={gallery.name}
        tags={tags}
        images={images || []}
      />
    </div>
  );
}
