import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChildForm } from "@/components/forms/child-form";

export default async function NewChildPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-8">Add a New Child</h1>
      <ChildForm 
        mode="create"
        initialData={{
          name: "",
          birthdate: new Date().toISOString().split('T')[0],
          interests: "",
          dislikes: "",
        }}
      />
    </div>
  );
}
