import type { ItemResponse } from "@/types/items";

/* ─── Internal UI shape used by ItemCard & marketplace page ─── */
export interface MarketplaceItem {
  id: string;
  transactionId: string;
  ownerId: string;
  title: string;
  category: string;
  categoryId: string;
  department: string;
  image: string;
  price: string | number;
  status: "Available Now" | "Low Stock";
  type: "LEND" | "SALE";
  rating: number;
  isFavorited: boolean;
  user: {
    name: string;
    initials: string;
    time: string;
  };
}

/* ─── Adapter: transform API response → UI shape ─── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapDisciplineToDepartment(location: string | null): string {
  const loc = location || "";
  if (loc.includes("Electrical")) return "ECE";
  if (loc.includes("Software") || loc.includes("Computer")) return "Computer Science";
  if (loc.includes("Mechanical")) return "Mechanical";
  if (loc.includes("Civil")) return "Civil Engineering";
  if (loc.includes("Architecture")) return "Architecture";
  return "All Departments";
}

export function toMarketplaceItem(item: ItemResponse): MarketplaceItem {
  const isFree = item.price === 0;
  return {
    id: item.id,
    transactionId: item.id, // using item id as transaction ref
    ownerId: item.ownerId,
    title: item.title,
    category: item.categoryName || "Other",
    categoryId: item.categoryId || "",
    department: mapDisciplineToDepartment(item.location),
    image: item.imageUrls?.[0] || "",
    price: isFree ? "Free" : item.price,
    status:
      item.status?.toLowerCase() === "low stock"
        ? "Low Stock"
        : "Available Now",
    type: isFree ? "LEND" : "SALE",
    rating: 4.5 + Math.random() * 0.5, // placeholder until backend adds ratings
    isFavorited: item.isFavorited,
    user: {
      name: item.ownerName || "UniCare User",
      initials: getInitials(item.ownerName || "UC"),
      time: timeAgo(item.createdAt),
    },
  };
}

/* ─── Fallback dummy data for when backend is unreachable ─── */
export const DUMMY_ITEMS: MarketplaceItem[] = [];

export const CATEGORIES = [
  "All Departments",
  "ECE",
  "Civil Engineering",
  "Architecture",
  "Mechanical",
  "Computer Science",
];
