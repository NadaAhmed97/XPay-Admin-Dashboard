"use client";

import React from "react";
import { useParams } from "next/navigation";
import TeamView from "./TeamView";

export default function MerchantTeamPage() {
  const { merchantId } = useParams() as { merchantId: string };
  return <TeamView merchantId={merchantId} />;
}
