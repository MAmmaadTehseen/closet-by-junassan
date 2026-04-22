import { notFound } from "next/navigation";
import { hasAdminEnv, createAdminClient } from "@/lib/supabase/admin";
import RecoverClient from "./RecoverClient";

export const metadata = {
  title: "Your cart",
  robots: { index: false, follow: false },
};

type Params = Promise<{ token: string }>;

export default async function RecoverCart({ params }: { params: Params }) {
  const { token } = await params;
  if (!hasAdminEnv() || !/^[a-f0-9]{32}$/i.test(token)) notFound();

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("cart_recoveries")
      .select("items_json,email")
      .eq("token", token)
      .maybeSingle();
    if (!data) notFound();

    await supabase
      .from("cart_recoveries")
      .update({ recovered_at: new Date().toISOString() })
      .eq("token", token);

    return <RecoverClient items={data.items_json} />;
  } catch {
    notFound();
  }
}
