"use client";

import Image from "next/image";
import Link from "next/link";
import { MdImage, MdChat } from "react-icons/md";

export interface RequestedItemWithImage {
  transactionId: string;
  itemTitle: string;
  chatId: string;
  requestedAt: string;
  image: string;
}

interface BorrowsSectionProps {
  items: RequestedItemWithImage[];
}

export default function BorrowsSection({ items }: BorrowsSectionProps) {
  return (
    <>
      <h2 className="text-xl font-bold text-neutral-900">Requested Products</h2>
      <p className="mt-1 text-sm text-neutral-500">Open chat directly with owners for your requests.</p>

      {items.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
          You haven&apos;t requested any products yet.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.transactionId} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.itemTitle} fill className="object-cover" />
                ) : (
                  <MdImage className="text-neutral-400 text-2xl" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-800">{item.itemTitle}</p>
                <p className="text-xs text-neutral-500">
                  Requested {new Date(item.requestedAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/chat?chatId=${item.chatId}&itemTitle=${encodeURIComponent(item.itemTitle)}`}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
                >
                  Open Chat
                  <MdChat className="text-[14px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
