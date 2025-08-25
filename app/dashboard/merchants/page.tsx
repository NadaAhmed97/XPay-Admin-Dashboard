"use client";

import React, { useMemo, useState } from "react";
import { Copy, Eye, Plus, Search, Users } from "lucide-react";

/** XPay mini atoms (dark + electric blue) */
const Btn = ({ className = "", variant = "default", ...props }: any) => (
  <button
    className={
      "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition " +
      (variant === "outline"
        ? "border border-[#2a3244] bg-transparent text-[#eef1fb] hover:bg-[#131621]/5"
        : variant === "ghost"
        ? "text-[#eef1fb] hover:bbg-[#131621]/5"
        : "bg-[#4a46ff] text-white hover:bg-[#3e3bff]") +
      (className ? " " + className : "")
    }
    {...props}
  />
);

const Badge = ({ children, color = "slate" }: any) => (
  <span
    className={
      `inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize ` +
      (color === "green"
        ? "bg-green-500 text-white"
        : color === "amber"
        ? "bg-amber-500 text-white"
        : color === "red"
        ? "bg-red-500 text-white"
        : color === "blue"
        ? "bg-indigo-500 text-white"
        : "bgbg-[#131621]/10 text-[#eef1fb]")
    }
  >
    {children}
  </span>
);

const Card = ({ title, actions, children }: any) => (
  <div className="rounded-2xl border border-[#2a3244] bg-[#131621] p-4 shadow-sm md:p-6">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-base font-bold md:text-lg text-[#eef1fb]">{title}</h3>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

/** types + mock */
export type MerchantRow = {
  id: string;
  name: string;
  status: "active" | "disabled" | "test";
  plan: "Starter" | "Growth" | "Enterprise";
  createdAt: string;
};

const MOCK: MerchantRow[] = [
  { id: "xp_9A2B-1C34", name: "Acme Co.", status: "active", plan: "Growth", createdAt: "2024-11-07" },
  { id: "xp_FF12-77AA", name: "Nour Bridal", status: "test", plan: "Starter", createdAt: "2025-01-13" },
  { id: "xp_00ZX-9Q12", name: "Edge Retail", status: "disabled", plan: "Enterprise", createdAt: "2023-09-02" },
  { id: "xp_ABCD-9999", name: "MOFA Storefront", status: "active", plan: "Enterprise", createdAt: "2024-03-22" },
];

export default function MerchantsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "disabled" | "test">("all");
  const [plan, setPlan] = useState<"all" | "Starter" | "Growth" | "Enterprise">("all");

  const filtered = useMemo(() => {
    return MOCK.filter(
      (m) =>
        (status === "all" || m.status === status) &&
        (plan === "all" || m.plan === plan) &&
        (m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.id.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, status, plan]);

  const copy = async (text: string) => await navigator.clipboard.writeText(text);
  const statusColor = (s: MerchantRow["status"]) => (s === "active" ? "green" : s === "test" ? "amber" : "red");

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 bg-[#0b0d12] text-[#eef1fb]">
      <Card

      >
        {/* Filters */}
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <div className="col-span-2 flex items-center gap-2 rounded-xl border border-[#2a3244] bg-[#131621] px-3 py-2">
            <Search className="h-4 w-4 text-[#aab2c8]" />
            <input
              className="w-full bg-transparent text-sm outline-none text-[#eef1fb] placeholder:text-[#aab2c8]"
              placeholder="Search by name or merchant ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-xl border border-[#2a3244] bg-[#131621] px-3 py-2 text-sm text-[#eef1fb] outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="test">Test</option>
            <option value="disabled">Disabled</option>
          </select>
          <select
            className="rounded-xl border border-[#2a3244] bg-[#131621] px-3 py-2 text-sm text-[#eef1fb] outline-none"
            value={plan}
            onChange={(e) => setPlan(e.target.value as any)}
          >
            <option value="all">All plans</option>
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[#2a3244]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1a1f2d] text-xs uppercase tracking-wide text-[#eef1fb] font-bold">
              <tr>
                <th className="px-4 py-3">Merchant</th>
                <th className="px-4 py-3">Merchant ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#131621]">
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-[#2a3244]">
                  <td className="px-4 py-3 font-semibold">{m.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-[#131621]/10 px-2 py-1 text-xs text-[#eef1fb]">{m.id}</code>
                      <button
                        onClick={() => copy(m.id)}
                        className="rounded p-1 hover:bg-[#131621]/10"
                        title="Copy ID"
                      >
                        <Copy className="h-4 w-4 text-[#aab2c8]" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={statusColor(m.status)}>{m.status}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{m.plan}</td>
                  <td className="px-4 py-3">{m.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/dashboard/merchants/${m.id}`}
                        className="inline-flex items-center rounded-2xl border border-[#2a3244] px-3 py-1.5 text-sm text-[#eef1fb] hover:bg-[#131621]/5"
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </a>
                      <a
                        href={`/dashboard/merchants/${m.id}/team`}
                        className="inline-flex items-center rounded-2xl border border-[#2a3244] px-3 py-1.5 text-sm text-[#eef1fb] hover:bg-[#131621]/5"
                      >
                        <Users className="mr-2 h-4 w-4" /> Manage Team
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
