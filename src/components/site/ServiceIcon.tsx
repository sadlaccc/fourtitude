import {
  BarChart3,
  Code2,
  Cpu,
  Globe,
  Lightbulb,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Globe,
  Lightbulb,
  Code2,
  ShieldCheck,
  BarChart3,
  Server,
  Workflow,
  Cpu,
  Sparkles,
};

export const iconNames = Object.keys(icons);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name] ?? Sparkles;
  return <Icon className={className} />;
}
