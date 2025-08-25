"use client";

import React from "react";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";

export default function MerchantDetailPage() {
  const { merchantId } = useParams() as { merchantId: string };

  const copy = async () => navigator.clipboard.writeText(merchantId);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <div className="rounded-2xl border border-gray-200 bg-[#131621] p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Merchant Overview</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500">Merchant ID</p>
            <div className="flex items-center gap-2">
              <code className="rounded bg-[#1a1f2d] px-2 py-1 text-xs">
                {merchantId}
              </code>
              <button
                onClick={copy}
                className="rounded p-1 hover:bg-[#1a1f2d]"
                title="Copy ID"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium">Acme Co.</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Plan</p>
            <p className="font-medium">Growth</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          {/* Absolute path to the team route under dashboard */}
          <a
            href={`/dashboard/merchants/${merchantId}/team`}
            className="rounded-2xl bg-black px-4 py-2 text-sm text-white"
          >
            Manage Team
          </a>
          <a
            href={`/dashboard/team?merchantId=${merchantId}`}
            className="rounded-2xl border border-[#2a3244] px-4 py-2 text-sm"
          >
            (Legacy) Team Page
          </a>
        </div>
      </div>
    </div>
  );
}
