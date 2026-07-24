import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard-shell";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <DashboardShell
      user={{
        id: user.id,
        email: user.email ?? "cliente@fronex.com",
        name:
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name
            : "",
      }}
    />
  );
}
