import { createClient } from "@/lib/supabase/server";
import UploadPage from "./upload-client";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = createClient();
  
  // Fetch all tags
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching tags:", error);
  }

  return <UploadPage tags={tags || []} />;
}
