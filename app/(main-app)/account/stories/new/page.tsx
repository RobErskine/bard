import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { StoryForm } from "@/components/forms/story-form";

export default async function NewChildPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-full py-8">
      <h1 className="text-2xl font-bold mb-8">Add a New Story</h1>
      <StoryForm mode="create" />
    </div>
  );
}
