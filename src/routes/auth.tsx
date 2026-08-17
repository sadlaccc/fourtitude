import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/profile.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | Fourtitude Technology Consultants" },
      { name: "description", content: "Sign in to the Fourtitude content management dashboard." },
      { property: "og:title", content: "Sign in | Fourtitude Technology Consultants" },
      { property: "og:description", content: "Staff access to the Fourtitude admin dashboard." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    void navigate({ to: "/admin" });
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
  }

  return (
    <SiteLayout>
      <section className="section-shell flex justify-center py-20">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
          <img src={logo.url} alt="Fourtitude logo" className="h-12 w-12 object-contain" />
          <h1 className="mt-4 text-2xl font-bold">Staff sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access the dashboard to manage services, team, articles, messages and users.
          </p>

          {session ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm">
                Signed in as <span className="font-medium">{session.user.email}</span>
              </p>
              <div className="flex gap-2">
                <Button onClick={() => void navigate({ to: "/admin" })}>Go to dashboard</Button>
                <Button variant="outline" onClick={() => void signOut()}>
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
