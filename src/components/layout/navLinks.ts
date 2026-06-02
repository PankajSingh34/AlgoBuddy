export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/visualizer", label: "Visualizer" },
  { href: "/practice", label: "Practice" },
  { href: "/dashboard", label: "Dashboard" },
];
