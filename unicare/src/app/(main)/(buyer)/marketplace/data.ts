import type { ItemResponse } from "@/features/items/types";

/* ─── Internal UI shape used by ItemCard & marketplace page ─── */
export interface MarketplaceItem {
  id: string;
  transactionId: string;
  ownerId: string;
  title: string;
  category: string;
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

export function toMarketplaceItem(item: ItemResponse): MarketplaceItem {
  const isFree = item.price === 0;
  return {
    id: item.id,
    transactionId: item.id, // using item id as transaction ref
    ownerId: item.ownerId,
    title: item.title,
    category: item.location || "General",
    department: item.currency || "Engineering",
    image: item.imageUrls?.[0] || "/placeholder-item.png",
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
export const DUMMY_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    transactionId: "a3d9f1d8-5a2e-4f4a-b7aa-8e2f6b0f9c11",
    ownerId: "bb12a67f-9c24-4ec6-8f3f-d2ef9d86e401",
    title: "Digital Oscilloscope",
    category: "Lab Equipment",
    department: "ECE",
    image: "/item-oscilloscope.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 4.8,
    isFavorited: false,
    user: { name: "John Doe", initials: "JD", time: "2h ago" },
  },
  {
    id: "2",
    transactionId: "c2f0e5ab-1d64-4d49-96aa-34b95e4a0f22",
    ownerId: "11f4c7be-6c7d-4a52-b676-8ab4e43c9d33",
    title: "Drafting Table",
    category: "Furniture",
    department: "Architecture",
    image: "/item-table.png",
    price: 120,
    status: "Low Stock" as const,
    type: "SALE" as const,
    rating: 4.5,
    isFavorited: false,
    user: { name: "Alice Smith", initials: "AS", time: "5h ago" },
  },
  {
    id: "3",
    transactionId: "d4b7a928-6bb8-4f84-9f8d-26ab8fa21e44",
    ownerId: "9aa13d20-8f3f-4e19-9de6-52f2fda8a655",
    title: "Arduino Starter Kit",
    category: "Microcontrollers",
    department: "ECE",
    image: "/item-arduino.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 5.0,
    isFavorited: false,
    user: { name: "Mark Knight", initials: "MK", time: "5m ago" },
  },
  {
    id: "4",
    transactionId: "e8c1d50b-0b2b-4a2c-9db8-7df4a8e3b266",
    ownerId: "4ed97321-c1b5-4c39-95f5-c7d4fca7f877",
    title: "Surveying Level",
    category: "Field Tools",
    department: "Civil Engineering",
    image: "/item-totalstation.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 4.9,
    isFavorited: false,
    user: { name: "Rock Starr", initials: "RS", time: "1d ago" },
  },
  {
    id: "5",
    transactionId: "f6a2c31d-3dc2-4c31-8ef5-a9bd8e1c7888",
    ownerId: "7c49d2e4-4c62-4f20-86a4-f4ac0f0f1999",
    title: "Raspberry Pi 4",
    category: "Computers",
    department: "ECE",
    image: "/item-raspberry.png",
    price: 35,
    status: "Available Now" as const,
    type: "SALE" as const,
    rating: 4.7,
    isFavorited: false,
    user: { name: "Evan Taylor", initials: "ET", time: "3h ago" },
  },
  {
    id: "6",
    transactionId: "1f7e2b0a-7a88-4c2f-9f3f-1bc2d8d6aa10",
    ownerId: "2aa6de2c-3f1f-4ea2-bd35-d02fd2842ab1",
    title: "Advanced Mechanics",
    category: "Books",
    department: "Mechanical",
    image: "/item-mechanics.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 4.2,
    isFavorited: false,
    user: { name: "Ben Porter", initials: "BP", time: "12h ago" },
  },
  {
    id: "7",
    transactionId: "2c5ad0f4-9d7e-47db-9eb5-4af8e98dbb21",
    ownerId: "6b2e91d3-1d2f-4dba-b8d4-0b99f7e6cc42",
    title: "Ender 3 3D Printer",
    category: "Equipment",
    department: "Mechanical",
    image: "/item-printer.png",
    price: 150,
    status: "Available Now" as const,
    type: "SALE" as const,
    rating: 4.6,
    isFavorited: false,
    user: { name: "Tina Lee", initials: "TL", time: "2d ago" },
  },
  {
    id: "8",
    transactionId: "3e94b2f7-5f6b-4ab9-bfc5-935f3d77de32",
    ownerId: "8d9e3ab1-2b89-4f41-9ae4-7e5fd9a1ef53",
    title: "TI-84 Plus CE",
    category: "Calculator",
    department: "Civil Engineering",
    image: "/item-calculator.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 5.0,
    isFavorited: false,
    user: { name: "Ava Miller", initials: "AM", time: "4h ago" },
  },
];

export const CATEGORIES = [
  "All Departments",
  "ECE",
  "Civil Engineering",
  "Architecture",
  "Mechanical",
  "Computer Science",
];
