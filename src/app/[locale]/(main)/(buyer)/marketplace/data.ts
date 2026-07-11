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
  images: string[];
  price: string | number;
  currency?: string;
  status: string;
  type: "LEND" | "SALE";
  isFavorited: boolean;
  user: {
    name: string;
    initials: string;
    time: string;
  };
  availableFrom?: string;
  availableTo?: string;
  description?: string;
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

function timeAgo(dateString: string, locale?: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60_000);
  const isAr = locale === "ar";
  if (minutes < 1) return isAr ? "الآن" : "just now";
  if (minutes < 60) return isAr ? `منذ ${minutes} دقيقة` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return isAr ? `منذ ${days} يوم` : `${days}d ago`;
}

function mapDisciplineToDepartment(location: string | null): string {
  const loc = location || "";
  if (loc.includes("Electrical")) return "ECE";
  if (loc.includes("Software") || loc.includes("Computer"))
    return "Computer Science";
  if (loc.includes("Mechanical")) return "Mechanical";
  if (loc.includes("Civil")) return "Civil Engineering";
  if (loc.includes("Architecture")) return "Architecture";
  return "All Departments";
}

export function toMarketplaceItem(item: ItemResponse, locale?: string): MarketplaceItem {
  const isFree = item.price <= 0.01;
  const hasAvailableFrom = typeof item.availableFrom === "string" && item.availableFrom.trim().length > 0;
  const hasAvailableTo = typeof item.availableTo === "string" && item.availableTo.trim().length > 0;
  const isLend = hasAvailableFrom || hasAvailableTo;

  // Map raw status (including numeric codes) to friendly names
  const rawStatus = item.status || "Available";
  let displayStatus = rawStatus;
  const normalizedStatus = rawStatus.trim().toLowerCase();
  if (normalizedStatus === "1" || normalizedStatus === "10" || normalizedStatus === "available" || normalizedStatus === "available now") {
    displayStatus = "Available";
  } else if (normalizedStatus === "0" || normalizedStatus === "40" || normalizedStatus === "draft") {
    displayStatus = "Draft";
  } else if (normalizedStatus === "2" || normalizedStatus === "20" || normalizedStatus === "rented" || normalizedStatus === "borrowed") {
    displayStatus = "Rented";
  } else if (normalizedStatus === "3" || normalizedStatus === "30" || normalizedStatus === "unavailable") {
    displayStatus = "Unavailable";
  } else if (normalizedStatus === "4" || normalizedStatus === "50" || normalizedStatus === "archived") {
    displayStatus = "Archived";
  } else if (/^\d+$/.test(normalizedStatus)) {
    displayStatus = "Available";
  } else {
    displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
  }

  return {
    id: item.id,
    transactionId: item.id, // using item id as transaction ref
    ownerId: item.ownerId,
    title: item.title,
    category: item.categoryName || "",
    categoryId: item.categoryId || "",
    department: mapDisciplineToDepartment(item.location),
    image: item.imageUrls?.[0] || "",
    images: item.imageUrls || [],
    price: isFree ? "Free" : item.price,
    currency: item.currency || "EGP",
    status: displayStatus,
    type: isLend ? "LEND" : "SALE",
    isFavorited: item.isFavorited,
    user: {
      name: item.ownerName || "UniCare User",
      initials: getInitials(item.ownerName || "UC"),
      time: timeAgo(item.createdAt, locale),
    },
    availableFrom: item.availableFrom,
    availableTo: item.availableTo,
    description: item.description,
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
