"use client";

import React from "react";
import { Copy, Edit3, Users, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

type Merchant = {
  id: string;
  name: string;
  domain: string;
  address: string;
  cityCountry: string;
  status: "active" | "disabled" | "test";
  plan: "Starter" | "Growth" | "Enterprise";
  createdAt: string;
  representative: { name: string; title: string; email: string; phone: string };
  teamCount: number;
};

const DATA: Record<string, Merchant> = {
  "xp_9A2B-1C34": {
    id: "xp_9A2B-1C34",
    name: "Acme Co.",
    domain: "acme.eg",
    address: "17 Test Street",
    cityCountry: "Cairo, Egypt",
    status: "active",
    plan: "Growth",
    createdAt: "2024-11-07",
    representative: { name: "Sara H.", title: "CEO", email: "sara@acme.eg", phone: "01025000613" },
    teamCount: 5,
  },
  "xp_FF12-77AA": {
    id: "xp_FF12-77AA",
    name: "Nour Bridal",
    domain: "nourbridal.eg",
    address: "12 Dokki Street",
    cityCountry: "Giza, Egypt",
    status: "test",
    plan: "Starter",
    createdAt: "2025-01-13",
    representative: { name: "Nour A.", title: "Owner", email: "owner@nourbridal.eg", phone: "01011112233" },
    teamCount: 2,
  },
};

const Badge = ({ children, color = "slate" }: any) => (
  <span
    className={
      `inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize ` +
      (color === "green" ? "bg-[#2ed573] text-black"
        : color === "amber" ? "bg-[#ffb020] text-black"
        : color === "red" ? "bg-[#ff4757] text-white"
        : "bg-[#2a3244] text-[#eef1fb]")}
  >
    {children}
  </span>
);

const Card = ({ title, actions, children }: any) => (
  <div className="rounded-2xl border border-[#2a3244] bg-[#0E1118] p-5 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-bold tracking-wide text-[#eef1fb] uppercase">{title}</h3>
      {actions}
    </div>
    {children}
  </div>
);

export default function MerchantDetailPage() {
  const { merchantId } = useParams() as { merchantId: string };
  const m = DATA[merchantId] ?? DATA["xp_9A2B-1C34"];
  const statusColor = m.status === "active" ? "green" : m.status === "test" ? "amber" : "red";
  const copyId = async () => navigator.clipboard.writeText(m.id);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 text-[#eef1fb]">
      <a href="/dashboard/merchants" className="inline-flex items-center text-sm text-[#a9b3c9] hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" /> Settings
      </a>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold">Business</h1>
        <Badge color={statusColor}>{m.status}</Badge>
      </div>

      {/* Business Details */}
      <Card
        title="Business Details"
        actions={
          <button
            className="inline-flex items-center rounded-xl border border-[#2a3244] px-3 py-1.5 text-sm text-[#eef1fb] hover:bg-[#141927]"
            title="Edit"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </button>
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#1c2333] p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{m.name}</h2>
              <button
                onClick={copyId}
                className="inline-flex items-center rounded-xl border border-[#2a3244] px-3 py-1.5 text-sm hover:bg-[#141927]"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Merchant ID
              </button>
            </div>
            <div className="mt-2 space-y-1 text-[#c9d3ea]">
              <p>{m.domain}</p>
              <p>{m.address}</p>
              <p>{m.cityCountry}</p>
              <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                <div><p className="text-xs text-[#a9b3c9]">Plan</p><p className="font-semibold">{m.plan}</p></div>
                <div>
                  <p className="text-xs text-[#a9b3c9]">Merchant ID</p>
                  <code className="rounded bg-[#1a1f2d] px-2 py-0.5 text-xs">{m.id}</code>
                </div>
                <div><p className="text-xs text-[#a9b3c9]">Created</p><p className="font-semibold">{m.createdAt}</p></div>
              </div>
            </div>
          </div>

          {/* Team summary */}
          <div className="rounded-2xl border border-[#1c2333] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-bold">Team</h3>
              <a
                href={`/dashboard/merchants/${m.id}/team`}
                className="inline-flex items-center rounded-xl border border-[#2a3244] px-3 py-1.5 text-sm hover:bg-[#141927]"
              >
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </a>
            </div>
            <p className="text-4xl font-extrabold">{m.teamCount}</p>
            <p className="text-sm text-[#a9b3c9]">members</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <a href={`/dashboard/merchants/${m.id}/team`} className="inline-block rounded-xl bg-white/90 px-3 py-2 text-center text-black hover:bg-white">
                View team
              </a>
              <a href={`/dashboard/merchants/${m.id}/team`} className="inline-block rounded-xl border border-[#2a3244] px-3 py-2 text-center hover:bg-[#141927]">
                Invite member
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Business Representative */}
      <Card
        title="Business Representative"
        actions={
          <button className="inline-flex items-center rounded-xl border border-[#2a3244] px-3 py-1.5 text-sm hover:bg-[#141927]">
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </button>
        }
      >
        <div className="rounded-2xl border border-[#1c2333] p-4">
          <h2 className="text-lg font-bold">{m.representative.name}</h2>
          <div className="mt-2 space-y-1 text-[#c9d3ea]">
            <p>{m.representative.title}</p>
            <p>{m.representative.email}</p>
            <p>{m.representative.phone}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
