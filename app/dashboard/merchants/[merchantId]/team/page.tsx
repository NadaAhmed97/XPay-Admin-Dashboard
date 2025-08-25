"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function MerchantTeamPage() {
  const { merchantId } = useParams() as { merchantId: string };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <h1 className="mb-4 text-2xl font-bold">Team — {merchantId}</h1>
      {/* TODO: paste your existing team table/UI here */}
    </div>
  );
}
