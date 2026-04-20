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
    transactionId: "7ef73c2a-84f4-49db-8a73-3608cc7d96b5",
    ownerId: "f6013dff-2066-4ce8-8291-67bc3bdd89d4",
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
    transactionId: "45ff0db0-2366-4875-9502-3072962f8127",
    ownerId: "3902b2f7-17b7-441c-bd4f-e8046584ab74",
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
    transactionId: "dd02fa9f-c3fc-4207-8c8b-57f32fce76c4",
    ownerId: "fbb90a17-d711-4e95-9392-5f09d8425f1b",
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
    transactionId: "f0f7db6c-0049-48e2-992e-8f03bcf2c56e",
    ownerId: "4ef2d73a-0edf-48cb-bd74-c6704ef625d7",
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
    transactionId: "bf9f4c45-cf2f-4278-abf8-0963c7af2a45",
    ownerId: "bbce1a85-ffb6-4f64-b48f-82374821f18f",
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
    transactionId: "4376d6cf-8aa3-43c6-9a23-c2f69b3faad4",
    ownerId: "e4656f54-95cc-4f84-8f2b-5a461f8abb2f",
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
    transactionId: "11c12249-47d8-4eb2-a75d-0f3a3670fd64",
    ownerId: "b8dd85d0-6d95-4935-a844-2dd67169810e",
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
    transactionId: "47ec42a0-bca6-4e7d-9df7-5716e818af39",
    ownerId: "757df7d2-e11c-4bda-9f5c-a3721e880f6a",
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
