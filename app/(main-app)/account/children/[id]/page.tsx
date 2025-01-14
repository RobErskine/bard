import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ChildForm } from "@/components/forms/child-form";

async function getChild(childId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .eq("user_id", user.id)
    .single();

  if (!child) {
    redirect("/account/#children");
  }

  return child;
}

interface ChildPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChildPage({ params }: ChildPageProps) {
  // Await the params to destructure id
  const { id } = await params;

  // Fetch the child data
  const child = await getChild(id);

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-8">
        Edit {child.name}&apos;s Details
      </h1>
      <ChildForm initialData={child} childId={child.id} />
    </div>
  );
}
