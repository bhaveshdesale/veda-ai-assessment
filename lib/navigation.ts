import {
  ClipboardList,
  FileText,
  Grid2X2,
  Library,
  Settings,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

export const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    icon: Grid2X2,
    href: "/",
  },
  {
    label: "My Classroom",
    icon: UsersRound,
    href: "/classroom",
  },
  {
    label: "Assignments",
    icon: ClipboardList,
    href: "/assignments",
  },
  {
    label: "Exams",
    icon: FileText,
    href: "/exams",
  },
  {
    label: "My Library",
    icon: Library,
    href: "/library",
  },
];

export const settingsNavigationItem: NavigationItem = {
  label: "Settings",
  icon: Settings,
  href: "/settings",
};