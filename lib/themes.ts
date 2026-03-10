export type LuxuryTheme = "aston" | "sartorial" | "alpine";

export const themeOptions: Array<{
  id: LuxuryTheme;
  label: string;
  subtitle: string;
  backgroundImage: string;
  accent: string;
  sourceUrl: string;
}> = [
  {
    id: "aston",
    label: "Aston Midnight",
    subtitle: "Grand tourer steel and shadow.",
    backgroundImage: "/images/v12-hero.jpg",
    accent: "#d4af37",
    sourceUrl: "https://www.astonmartin.com/zh-cn/models/brochures/v12-roadster",
  },
  {
    id: "sartorial",
    label: "Sartorial Reserve",
    subtitle: "Tailoring, texture, restraint.",
    backgroundImage: "https://source.unsplash.com/owpZrpicpXM/1920x1200",
    accent: "#c8c8c8",
    sourceUrl: "https://unsplash.com/photos/man-in-black-suit-jacket-owpZrpicpXM",
  },
  {
    id: "alpine",
    label: "Alpine Lodge",
    subtitle: "Quiet altitude, warm light.",
    backgroundImage: "https://source.unsplash.com/IblRxFbpOzg/1920x1200",
    accent: "#9bb7c9",
    sourceUrl: "https://unsplash.com/photos/cozy-cabin-in-snowy-landscape-with-reflections-IblRxFbpOzg",
  },
];

export const sideNavGroups = [
  {
    title: "Core",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Private Journal", href: "/archives" },
      { label: "Secure Depository", href: "/depository" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Archive Partitions",
    items: [
      { label: "Life Chronicle", href: "/archives?category=life" },
      { label: "Notes Index", href: "/archives?category=notes" },
      { label: "Research Ledger", href: "/archives?category=research" },
      { label: "Technical Dossier", href: "/archives?category=tech" },
    ],
  },
];
