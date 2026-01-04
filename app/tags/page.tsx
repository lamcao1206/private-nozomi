import { createClient } from "@/lib/supabase/server";
import TagsPage from "./tags-client";

export default async function Page() {
  const supabase = createClient();
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tags:", error);
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Error loading tags
          </h1>
          <p className="text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return <TagsPage tags={tags || []} />;
}
