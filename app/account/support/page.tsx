"use client";

import Link from "next/link";
import ChatWindow from "@/components/chat/ChatWindow";
import {
  accountCardClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

export default function AccountSupportPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Glamira Support
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            Chat privately with our admin support team. This is the same
            conversation as the floating chat button.
          </p>
        </div>
        <Link href="/products" className={accountSecondaryBtnClass}>
          Continue Shopping
        </Link>
      </div>

      <div className={`${accountCardClass} !p-2 sm:!p-3`}>
        <div className="h-[65vh] min-h-[520px]">
          <ChatWindow
            mode="user"
            title="Glamira Support"
            subtitle="Ask about products, orders, or delivery"
          />
        </div>
      </div>
    </div>
  );
}
