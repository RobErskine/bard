import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: children = [], error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', user.id);

  console.log(user.id)
  console.log('children', children, error)

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div>
        <h2>Manage children in your account</h2>
        {(children?.length === 0 || !children) ? (
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
                  <p className="text-sm text-muted-foreground">{child.birthdate}</p>
                </div>
                <Link href={`/account/children/${child.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
