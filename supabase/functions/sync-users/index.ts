import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ╔════════════════════════════════════════════════════╗
// ║  ADD YOUR USERS HERE                               ║
// ║  Just add { email, password } objects below         ║
// ║  Push to GitHub → call /sync-users to create them   ║
// ╚════════════════════════════════════════════════════╝
const USERS = [
  { email: "owner@xtoolfb.tool", password: "owner2026@" },
  { email: "BladeRunner2049@gmail.com", password: "BladeRunner2049" },
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results: { email: string; status: string }[] = [];

    for (const user of USERS) {
      // Try to create — if user exists, it'll return an error we can catch
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (error) {
        if (error.message.includes("already been registered")) {
          results.push({ email: user.email, status: "already exists" });
        } else {
          results.push({ email: user.email, status: `error: ${error.message}` });
        }
      } else {
        results.push({ email: user.email, status: "created" });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
