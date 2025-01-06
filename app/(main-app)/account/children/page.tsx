import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default async function ChildrenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch children (you'll need to create this table in your Supabase database)
  const { data: children } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id);

  return (
    <div className="flex-1 w-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Your Children</h1>
        <Link href="/account/children/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Child
          </Button>
        </Link>
      </div>

      {children?.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          You haven't added any children yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {children?.map((child) => (
            <div
              key={child.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{child.name}</h3>
                <p className="text-sm text-muted-foreground">Age: {child.age}</p>
              </div>
              <Link href={`/account/children/${child.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}