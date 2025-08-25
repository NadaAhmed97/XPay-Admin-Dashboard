"use client";

import { useRouter } from "next/navigation";
import ManagePolicies from "./ManagePolicies";

export default function PoliciesPage() {
  const router = useRouter();
  return (
    <ManagePolicies
      open
      onClose={() => {
        // when the sheet closes, go back to Team
        router.push("/dashboard/team");
      }}
    />
  );
}
