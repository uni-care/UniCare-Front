import type { Metadata } from "next";
import { cookies } from "next/headers";
import { toMarketplaceItem } from "../data";
import ItemDetailClient from "@/components/marketplace/details/ItemDetailClient";

const API_URL = "https://unicare.runasp.net";

interface Props {
  params: Promise<{ id: string }>;
}

// 1. Dynamic SEO Metadata (Server-side rendering)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/Items/${id}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    const rawItem = await res.json();
    return {
      title: `${rawItem.title} | UniCare`,
      description: rawItem.description || `Request or borrow "${rawItem.title}" on UniCare campus marketplace.`,
    };
  } catch {
    return {
      title: "Marketplace Item Details | UniCare",
      description: "View marketplace resource details.",
    };
  }
}

// 2. Main Page (Server Component)
export default async function DetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  let item = null;
  try {
    const res = await fetch(`${API_URL}/api/v1/Items/${id}`, {
      headers,
      cache: "no-store",
    });
    if (res.ok) {
      const rawItem = await res.json();
      item = toMarketplaceItem(rawItem);
    }
  } catch (err) {
    console.error("Error fetching item on server:", err);
  }

  return <ItemDetailClient initialItem={item} id={id} />;
}
