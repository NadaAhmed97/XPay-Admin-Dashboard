"use client";

import React from "react";
import AccessManagementPage from "../../../team/page";

export default function MerchantTeamWrapper({
  params,
}: {
  params: { merchantId: string };
}) {
  // In this mock, AccessManagementPage shows sample data.
  // Later: refactor AccessManagementPage to accept merchantId as a prop and fetch real data.
  return <AccessManagementPage />;
}
