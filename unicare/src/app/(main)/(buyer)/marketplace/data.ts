export interface MarketplaceItem {
  id: number;
  title: string;
  category: string;
  department: string;
  image: string;
  price: string | number;
  status: "Available Now" | "Low Stock";
  type: "LEND" | "SALE";
  rating: number;
  user: {
    name: string;
    initials: string;
    time: string;
  };
}

export const DUMMY_ITEMS: MarketplaceItem[] = [
  {
    id: 1,
    title: "Digital Oscilloscope",
    category: "Lab Equipment",
    department: "ECE",
    image: "/item-oscilloscope.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 4.8,
    user: { name: "John Doe", initials: "JD", time: "2h ago" },
  },
  {
    id: 2,
    title: "Drafting Table",
    category: "Furniture",
    department: "Architecture",
    image: "/item-table.png",
    price: 120,
    status: "Low Stock" as const,
    type: "SALE" as const,
    rating: 4.5,
    user: { name: "Alice Smith", initials: "AS", time: "5h ago" },
  },
  {
    id: 3,
    title: "Arduino Starter Kit",
    category: "Microcontrollers",
    department: "ECE",
    image: "/item-arduino.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 5.0,
    user: { name: "Mark Knight", initials: "MK", time: "5m ago" },
  },
  {
    id: 4,
    title: "Surveying Level",
    category: "Field Tools",
    department: "Civil Engineering",
    image: "/item-totalstation.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 4.9,
    user: { name: "Rock Starr", initials: "RS", time: "1d ago" },
  },
  {
    id: 5,
    title: "Raspberry Pi 4",
    category: "Computers",
    department: "ECE",
    image: "/item-raspberry.png",
    price: 35,
    status: "Available Now" as const,
    type: "SALE" as const,
    rating: 4.7,
    user: { name: "Evan Taylor", initials: "ET", time: "3h ago" },
  },
  {
    id: 6,
    title: "Advanced Mechanics",
    category: "Books",
    department: "Mechanical",
    image: "/item-mechanics.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 4.2,
    user: { name: "Ben Porter", initials: "BP", time: "12h ago" },
  },
  {
    id: 7,
    title: "Ender 3 3D Printer",
    category: "Equipment",
    department: "Mechanical",
    image: "/item-printer.png",
    price: 150,
    status: "Available Now" as const,
    type: "SALE" as const,
    rating: 4.6,
    user: { name: "Tina Lee", initials: "TL", time: "2d ago" },
  },
  {
    id: 8,
    title: "TI-84 Plus CE",
    category: "Calculator",
    department: "Civil Engineering",
    image: "/item-calculator.png",
    price: "Free",
    status: "Available Now" as const,
    type: "LEND" as const,
    rating: 5.0,
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
