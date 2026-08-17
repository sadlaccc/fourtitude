import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { settingsQuery } from "@/lib/content";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Fourtitude Technology Consultants" },
      {
        name: "description",
        content:
          "Get in touch with Fourtitude Technology Consultants LTD in Nairobi — call, email or send us a message to schedule a consultation.",
      },
      { property: "og:title", content: "Contact Fourtitude Technology Consultants" },
      { property: "og:description", content: "Schedule a consultation with our team in Nairobi, Kenya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const empty = { name: "", email: "", phone: "", subject: "", message: "" };

function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);
  const [form, setForm] = useState(empty);

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contact_messages").insert(form);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setForm(empty);
      toast.success("Message sent. We'll be in touch shortly.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (key: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        lead="Let us know your availability so we can schedule an appointment that suits your convenience."
      />

      <section className="section-shell grid gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {[
            {
              icon: Phone,
              label: "Phone",
              value: `${settings?.phone ?? "+254726900262"}${settings?.phone_alt ? ` · ${settings.phone_alt}` : ""}`,
            },
            { icon: Mail, label: "Email", value: settings?.email ?? "info@fourtitude.co.ke" },
            { icon: MapPin, label: "Office", value: settings?.address ?? "Nairobi, Kenya" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-5">
              <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" /> {label}
              </p>
              <p className="mt-2 font-medium break-words">{value}</p>
            </div>
          ))}
        </div>

        <form
          className="rounded-xl border border-border bg-card p-7"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={set("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={set("subject")} />
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={6} required value={form.message} onChange={set("message")} />
          </div>
          <Button type="submit" className="mt-6" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </section>
    </SiteLayout>
  );
}
