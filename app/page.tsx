import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/gallery-grid";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 50;
  const offset = (page - 1) * limit;

  const supabase = createClient();

  // Fetch galleries with tags and image count
  const { data: galleries, error } = await supabase
    .from("galleries")
    .select(`
      id,
      name,
      description,
      created_at,
      images (count)
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching galleries:", error);
  }

  // Fetch tags for each gallery
  const galleriesWithTags = await Promise.all(
    (galleries || []).map(async (gallery) => {
      const { data: tags } = await supabase
        .from("gallery_tags")
        .select(`
          tags (
            id,
            name
          )
        `)
        .eq("gallery_id", gallery.id);

      // Get cover image (first image)
      const { data: images } = await supabase
        .from("images")
        .select("url")
        .eq("gallery_id", gallery.id)
        .limit(1)
        .single();

      return {
        ...gallery,
        tags: tags?.map((t: any) => t.tags) || [],
        imageCount: gallery.images?.[0]?.count || 0,
        coverImage: images?.url || null,
      };
    })
  );

  // Get total count for pagination
  const { count } = await supabase
    .from("galleries")
    .select("*", { count: "exact", head: true });

  const totalPages = Math.ceil((count || 0) / limit);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Galleries</h1>
        <p className="text-muted-foreground mt-2">
          Browse all uploaded galleries
        </p>
      </div>

      <Separator className="mb-8" />

      <GalleryGrid
        galleries={galleriesWithTags}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
