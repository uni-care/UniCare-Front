import { Suspense } from "react";

import ChatPageClient from "@/app/(main)/chat/chat";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-100 px-4 pb-10 pt-28 md:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-neutral-500">Loading chat...</p>
          </div>
        </div>
      }
    >
      <ChatPageClient />
    </Suspense>
  );
}
