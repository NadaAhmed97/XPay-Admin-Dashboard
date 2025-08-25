"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DEFAULTS, PERMISSIONS } from "./defaults";
import type { Level, PermissionKey, PolicySet, Role, PermissionMeta } from "./types";
import { RotateCcw, Save, X } from "lucide-react";

const levelLabel: Record<Level, string> = {
  allow: "Allow",
  deny: "Deny",
  masked: "Masked",
  noPII: "No PII",
  limit: "Up to limit",
};
const levelOrder: Level[] = ["allow", "masked", "noPII", "limit", "deny"];

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className="w-full rounded-lg border border-[#2a3244] bg-[#131621] px-2 py-1.5 text-sm text-[#eef1fb]"
    {...props}
  />
);

type Props = { open: boolean; onClose: () => void };
const STORAGE_KEY = "xpay.policies.v1";

export default function ManagePolicies({ open, onClose }: Props) {
  const [role, setRole] = useState<Role>("admin");
  const [policies, setPolicies] = useState<PolicySet>(DEFAULTS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPolicies(JSON.parse(raw) as PolicySet);
    } catch {}
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<string, PermissionKey[]>();
    PERMISSIONS.forEach((p: PermissionMeta) => {
      if (!groups.has(p.group)) groups.set(p.group, []);
      groups.get(p.group)!.push(p.key);
    });
    return groups;
  }, []);

  const current = policies[role];

  const setLevel = (key: PermissionKey, lvl: Level) =>
    setPolicies((prev) => ({ ...prev, [role]: { ...prev[role], [key]: lvl } }));

  const resetToDefaults = () =>
    setPolicies((prev) => ({ ...prev, [role]: DEFAULTS[role] }));

  const save = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(policies));
      // await fetch("/api/policies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(policies) });
    } finally {
      setSaving(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center">
      {/* SHEET */}
      <div className="w-full max-w-5xl h-[90%] md:h-[80%] bg-[#131621] shadow-2xl rounded-t-2xl md:rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a3244] px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#eef1fb]">Manage Policies</h2>
            <span className="text-sm text-[#aab2c8]">Role:</span>
            <Select value={role} onChange={(e) => setRole(e.currentTarget.value as Role)}>
              {(Object.keys(DEFAULTS) as Role[]).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
            <button
              className="inline-flex items-center rounded-lg border border-[#2a3244] px-3 py-1.5 text-sm text-[#eef1fb] hover:bg-[#1a1f2d]"
              onClick={resetToDefaults}
              title="Reset role to defaults"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset defaults
            </button>
          </div>
          <button
            className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-[#aab2c8] hover:bg-[#1a1f2d]"
            onClick={onClose}
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (scrolls) */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {Array.from(grouped.entries()).map(([group, keys]) => (
            <div key={group} className="mb-6 rounded-xl border border-[#2a3244]">
              <div className="border-b border-[#2a3244] bg-[#1a1f2d] px-4 py-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#eef1fb]">
                  {group}
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {keys.map((k) => {
                  const meta = PERMISSIONS.find((p) => p.key === k)!;
                  const levels = (meta.levels ?? ["allow", "deny"]) as Level[];
                  const value = current[k];

                  return (
                    <div key={k} className="grid grid-cols-1 gap-2 px-4 py-3 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <p className="font-medium text-[#eef1fb]">{meta.label}</p>
                      </div>
                      <div>
                        <Select
                          value={value}
                          onChange={(e) => setLevel(k, e.currentTarget.value as Level)}
                        >
                          {levelOrder
                            .filter((l) => levels.includes(l))
                            .map((l) => (
                              <option key={l} value={l}>
                                {levelLabel[l]}
                              </option>
                            ))}
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer (sticky) */}
        <div
          className="sticky bottom-0 z-10 border-t border-[#2a3244] bg-[#131621] px-6 py-4"
          style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#aab2c8]">
              Changes apply to all members with the selected role. Server must enforce masking/limits.
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center rounded-lg border border-[#2a3244] px-4 py-2 text-sm text-[#eef1fb] hover:bg-[#1a1f2d]"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-[#3e3bff] disabled:opacity-60"
                onClick={save}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
