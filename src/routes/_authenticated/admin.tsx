import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  formatDate,
  messagesQuery,
  postsQuery,
  servicesQuery,
  settingsQuery,
  teamQuery,
  type Post,
  type Service,
  type TeamMember,
} from "@/lib/content";
import logo from "@/assets/profile.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard | Fourtitude Technology Consultants" },
      { name: "description", content: "Manage website content, messages and users." },
      { property: "og:title", content: "Admin Dashboard | Fourtitude" },
      { property: "og:description", content: "Internal content management dashboard." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  if (loading) {
    return <div className="section-shell py-20 text-muted-foreground">Loading dashboard…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="section-shell max-w-lg py-24 text-center">
        <h1 className="text-2xl font-bold">Not authorised</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account ({user?.email}) does not have admin access.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild variant="outline">
            <Link to="/">Back to site</Link>
          </Button>
          <Button onClick={() => void signOut()}>Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="section-shell flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="Fourtitude logo" className="h-9 w-9 object-contain" />
            <span className="text-sm font-semibold">Content dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user?.email}</span>
            <Button size="sm" variant="outline" onClick={() => void signOut()}>
              <LogOut className="mr-1 h-3.5 w-3.5" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="section-shell py-10">
        <h1 className="text-2xl font-bold">Manage your website</h1>
        <Tabs defaultValue="services" className="mt-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="posts">Blog</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Site settings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <ServicesAdmin />
          </TabsContent>
          <TabsContent value="team" className="mt-6">
            <TeamAdmin />
          </TabsContent>
          <TabsContent value="posts" className="mt-6">
            <PostsAdmin />
          </TabsContent>
          <TabsContent value="messages" className="mt-6">
            <MessagesAdmin />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <SettingsAdmin />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UsersAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function useTableMutations(table: "services" | "team_members" | "posts", queryKey: string[]) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from(table).update(values as never).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const insert = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from(table).insert(values as never);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Created");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return { update, insert, remove };
}

function Row({ children }: { children: React.ReactNode }) {
  return <Card className="border-border/70"><CardContent className="grid gap-3 p-5">{children}</CardContent></Card>;
}

function ServicesAdmin() {
  const { data: services = [] } = useQuery(servicesQuery);
  const { update, insert, remove } = useTableMutations("services", ["services"]);
  const [draft, setDraft] = useState({ title: "", slug: "", summary: "" });

  return (
    <div className="space-y-4">
      <Row>
        <h2 className="font-semibold">Add a service</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Input
            placeholder="Slug (e.g. cloud-services)"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          />
          <Input
            placeholder="Short summary"
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
          />
        </div>
        <div>
          <Button
            size="sm"
            disabled={!draft.title || !draft.slug}
            onClick={() => {
              insert.mutate({ ...draft, sort_order: services.length + 1 });
              setDraft({ title: "", slug: "", summary: "" });
            }}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add service
          </Button>
        </div>
      </Row>

      {services.map((service: Service) => (
        <ServiceEditor
          key={service.id}
          service={service}
          onSave={(values) => update.mutate({ id: service.id, values })}
          onDelete={() => remove.mutate(service.id)}
        />
      ))}
    </div>
  );
}

function ServiceEditor({
  service,
  onSave,
  onDelete,
}: {
  service: Service;
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [form, setForm] = useState(service);
  return (
    <Row>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <Label>Icon (lucide name)</Label>
          <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label>Summary</Label>
        <Input value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
      </div>
      <div className="grid gap-1.5">
        <Label>Details</Label>
        <Textarea rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          Published
        </label>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Order</Label>
          <Input
            type="number"
            className="w-20"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              onSave({
                title: form.title,
                icon: form.icon,
                summary: form.summary,
                details: form.details,
                published: form.published,
                sort_order: form.sort_order,
              })
            }
          >
            Save
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Row>
  );
}

function TeamAdmin() {
  const { data: team = [] } = useQuery(teamQuery);
  const { update, insert, remove } = useTableMutations("team_members", ["team_members"]);
  const [draft, setDraft] = useState({ name: "", title: "" });

  return (
    <div className="space-y-4">
      <Row>
        <h2 className="font-semibold">Add a team member</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input placeholder="Role" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </div>
        <div>
          <Button
            size="sm"
            disabled={!draft.name}
            onClick={() => {
              insert.mutate({ ...draft, sort_order: team.length + 1 });
              setDraft({ name: "", title: "" });
            }}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add member
          </Button>
        </div>
      </Row>

      {team.map((member: TeamMember) => (
        <MemberEditor
          key={member.id}
          member={member}
          onSave={(values) => update.mutate({ id: member.id, values })}
          onDelete={() => remove.mutate(member.id)}
        />
      ))}
    </div>
  );
}

function MemberEditor({
  member,
  onSave,
  onDelete,
}: {
  member: TeamMember;
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [form, setForm] = useState(member);
  return (
    <Row>
      <div className="flex items-center gap-4">
        {form.photo_url && (
          <img src={form.photo_url} alt={form.name} className="h-14 w-14 rounded-full object-cover object-top" />
        )}
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label>Photo URL</Label>
        <Input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
      </div>
      <div className="grid gap-1.5">
        <Label>Bio</Label>
        <Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          Published
        </label>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              onSave({
                name: form.name,
                title: form.title,
                photo_url: form.photo_url,
                bio: form.bio,
                published: form.published,
              })
            }
          >
            Save
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Row>
  );
}

function PostsAdmin() {
  const { data: posts = [] } = useQuery(postsQuery);
  const { update, insert, remove } = useTableMutations("posts", ["posts"]);
  const [draft, setDraft] = useState({ title: "", slug: "" });

  return (
    <div className="space-y-4">
      <Row>
        <h2 className="font-semibold">New article</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <Input placeholder="Slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
        </div>
        <div>
          <Button
            size="sm"
            disabled={!draft.title || !draft.slug}
            onClick={() => {
              insert.mutate({ ...draft, published: false });
              setDraft({ title: "", slug: "" });
            }}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Create draft
          </Button>
        </div>
      </Row>

      {posts.map((post: Post) => (
        <PostEditor
          key={post.id}
          post={post}
          onSave={(values) => update.mutate({ id: post.id, values })}
          onDelete={() => remove.mutate(post.id)}
        />
      ))}
    </div>
  );
}

function PostEditor({
  post,
  onSave,
  onDelete,
}: {
  post: Post;
  onSave: (values: Record<string, unknown>) => void;
  onDelete: () => void;
}) {
  const [form, setForm] = useState(post);
  return (
    <Row>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
      </div>
      <div className="grid gap-1.5">
        <Label>Excerpt</Label>
        <Textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>
      <div className="grid gap-1.5">
        <Label>Content</Label>
        <Textarea rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
          Published
        </label>
        <span className="text-xs text-muted-foreground">{formatDate(form.published_at)}</span>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              onSave({
                title: form.title,
                category: form.category,
                author: form.author,
                excerpt: form.excerpt,
                content: form.content,
                published: form.published,
              })
            }
          >
            Save
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Row>
  );
}

function MessagesAdmin() {
  const { data: messages = [] } = useQuery(messagesQuery);
  const queryClient = useQueryClient();

  const toggle = useMutation({
    mutationFn: async ({ id, handled }: { id: string; handled: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ handled }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_messages"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_messages"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Row key={message.id}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-semibold">{message.subject || "No subject"}</p>
            <span className="text-xs text-muted-foreground">{formatDate(message.created_at)}</span>
            <label className="ml-auto flex items-center gap-2 text-xs">
              <Switch
                checked={message.handled}
                onCheckedChange={(v) => toggle.mutate({ id: message.id, handled: v })}
              />
              Handled
            </label>
            <Button size="sm" variant="destructive" onClick={() => remove.mutate(message.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {message.name} · {message.email} {message.phone && `· ${message.phone}`}
          </p>
          <p className="whitespace-pre-line text-sm">{message.message}</p>
        </Row>
      ))}
    </div>
  );
}

function SettingsAdmin() {
  const { data: settings } = useQuery(settingsQuery);
  const queryClient = useQueryClient();
  const [form, setForm] = useState(settings);

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const { error } = await supabase.from("site_settings").update(values as never).eq("id", 1);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Settings saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const current = form ?? settings;
  if (!current) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const field = (key: keyof typeof current, label: string, textarea = false) => (
    <div className="grid gap-1.5" key={key as string}>
      <Label>{label}</Label>
      {textarea ? (
        <Textarea
          rows={3}
          value={String(current[key] ?? "")}
          onChange={(e) => setForm({ ...current, [key]: e.target.value })}
        />
      ) : (
        <Input
          value={String(current[key] ?? "")}
          onChange={(e) => setForm({ ...current, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <Row>
      {field("company_name", "Company name")}
      {field("tagline", "Tagline")}
      {field("hero_title", "Hero title")}
      {field("hero_subtitle", "Hero subtitle", true)}
      {field("about", "About", true)}
      {field("mission", "Mission", true)}
      {field("vision", "Vision", true)}
      <div className="grid gap-3 sm:grid-cols-2">
        {field("email", "Email")}
        {field("phone", "Phone")}
        {field("phone_alt", "Alternate phone")}
        {field("address", "Address")}
        {field("linkedin", "LinkedIn URL")}
        {field("facebook", "Facebook URL")}
        {field("twitter", "X / Twitter URL")}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {(["stat_clients", "stat_projects", "stat_partners"] as const).map((key) => (
          <div className="grid gap-1.5" key={key}>
            <Label>{key.replace("stat_", "")}</Label>
            <Input
              type="number"
              value={Number(current[key] ?? 0)}
              onChange={(e) => setForm({ ...current, [key]: Number(e.target.value) })}
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          size="sm"
          onClick={() => {
            const { id: _id, updated_at: _u, ...values } = current;
            save.mutate(values);
          }}
        >
          Save settings
        </Button>
      </div>
    </Row>
  );
}

function UsersAdmin() {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const [{ data: profiles, error }, { data: roles, error: rolesError }] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("user_roles").select("*"),
      ]);
      if (error) throw new Error(error.message);
      if (rolesError) throw new Error(rolesError.message);
      return (profiles ?? []).map((profile) => ({
        ...profile,
        isAdmin: (roles ?? []).some((r) => r.user_id === profile.id && r.role === "admin"),
      }));
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, makeAdmin }: { userId: string; makeAdmin: boolean }) => {
      if (makeAdmin) {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", "admin");
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      toast.success("Role updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <Row>
        <h2 className="font-semibold">Invite a new user</h2>
        <NewUserForm onCreated={() => queryClient.invalidateQueries({ queryKey: ["admin_users"] })} />
      </Row>

      {users.map((user) => (
        <Row key={user.id}>
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="font-medium">{user.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <label className="ml-auto flex items-center gap-2 text-sm">
              <Switch
                checked={user.isAdmin}
                onCheckedChange={(v) => setRole.mutate({ userId: user.id, makeAdmin: v })}
              />
              Administrator
            </label>
          </div>
        </Row>
      ))}
    </div>
  );
}

function NewUserForm({ onCreated }: { onCreated: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("User created. They must confirm their email before signing in.");
    setEmail("");
    setPassword("");
    setFullName("");
    onCreated();
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          placeholder="Temporary password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <Button size="sm" disabled={busy || !email || password.length < 6} onClick={() => void create()}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Create user
        </Button>
      </div>
    </>
  );
}
