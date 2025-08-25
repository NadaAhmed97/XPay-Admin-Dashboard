"use client";

import React, { useMemo, useState } from "react";
import {
  Check, Copy, EllipsisVertical, Eye, KeyRound, MailPlus,
  Shield, Trash2, UserPlus
} from "lucide-react";

type Role = "owner" | "admin" | "accountant" | "support" | "developer" | "sales" | "viewer";

type Member = {
  id: string; name: string; email: string; role: Role;
  status: "active" | "invited" | "suspended"; twoFA: boolean;
  lastSeen: string; scopes: string[];
};

const ROLES: Role[] = ["owner","admin","accountant","support","developer","sales","viewer"];
const roleColor = (r: Role) =>
  ({ owner:"blue", admin:"green", accountant:"amber", support:"slate", developer:"slate", sales:"slate", viewer:"slate" } as const)[r];

const Badge = ({ children, color = "slate" }: any) => (
  <span className={
    `inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize ` +
    (color === "green" ? "bg-[#2ed573] text-black"
     : color === "amber" ? "bg-[#ffb020] text-black"
     : color === "red" ? "bg-[#ff4757] text-white"
     : color === "blue" ? "bg-[#4c6fff] text-white"
     : "bg-[#2a3244] text-[#eef1fb]")}>
    {children}
  </span>
);

const Button = ({ className = "", variant = "default", ...props }: any) => (
  <button
    className={
      "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:shadow md:px-5 md:py-2.5 " +
      (variant === "outline"
        ? "border border-[#2a3244] bg-transparent text-[#eef1fb] hover:bg-[#141927]"
        : variant === "ghost"
        ? "hover:bg-[#141927] text-[#eef1fb]"
        : variant === "destructive"
        ? "bg-[#ff3b30] text-white hover:bg-[#e22e24]"
        : "bg-white/90 text-black hover:bg-white") +
      (className ? " " + className : "")
    }
    {...props}
  />
);

const Card = ({ title, actions, children }: any) => (
  <div className="rounded-2xl border border-[#2a3244] bg-[#0E1118] p-4 shadow-sm md:p-6">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-base font-bold md:text-lg text-[#eef1fb]">{title}</h3>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

const sampleMembers: Member[] = [
  { id:"u_01", name:"Nada Saeed", email:"nada@acme.co", role:"owner", status:"active", twoFA:true, lastSeen:"3m ago", scopes:["merchant:xp_9A2B-1C34"] },
  { id:"u_02", name:"Alaa Said", email:"alaa@acme.co", role:"accountant", status:"active", twoFA:true, lastSeen:"1h ago", scopes:["merchant:xp_9A2B-1C34"] },
  { id:"u_03", name:"NBE Observer", email:"team@nbe.com", role:"viewer", status:"active", twoFA:false, lastSeen:"—", scopes:["org:NBE:*"] },
];

export default function TeamView({ merchantId }: { merchantId: string }) {
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  const handleInvite = (payload: { name: string; email: string; role: Role; scope: string; }) => {
    const newMember: Member = {
      id: crypto.randomUUID(), name: payload.name, email: payload.email, role: payload.role,
      status: "invited", twoFA: false, lastSeen: "—", scopes: [payload.scope],
    };
    setMembers((prev) => [newMember, ...prev]); setShowInvite(false);
  };

  const revokeMember = (id: string) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const updateMember = (updated: Member) => { setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m))); setEditing(null); };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 text-[#eef1fb]">
      <Card
        title="Merchant Overview"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(merchantId)}>
              <Copy className="mr-2 h-4 w-4" /> Copy Merchant ID
            </Button>
            <Badge color="green">active</Badge>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div><p className="text-xs text-[#a9b3c9]">Merchant ID</p><p className="font-semibold">{merchantId}</p></div>
          <div><p className="text-xs text-[#a9b3c9]">Merchant Name</p><p className="font-semibold">Acme Co.</p></div>
          <div><p className="text-xs text-[#a9b3c9]">Plan</p><p className="font-semibold">Growth</p></div>
          <div><p className="text-xs text-[#a9b3c9]">Created</p><p className="font-semibold">2024-11-07</p></div>
        </div>
      </Card>

      <Card
        title="Team & Access"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowInvite(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Member
            </Button>
            <a
              href="/dashboard/team/policies"
              className="inline-flex items-center rounded-2xl border border-[#2a3244] px-3 py-2 text-sm hover:bg-[#141927]"
              title="Manage Policies"
            >
              <KeyRound className="mr-2 h-4 w-4" /> Manage Policies
            </a>
            <Button variant="ghost" title="More"><EllipsisVertical className="h-5 w-5" /></Button>
          </>
        }
      >
        <div className="overflow-hidden rounded-xl border border-[#2a3244]">
          <table className="w-full text-left text-sm text-[#eef1fb]">
            <thead className="bg-[#141927] text-xs uppercase tracking-wide font-bold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">2FA</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Last Seen</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-t border-[#2a3244]">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-xs text-[#a9b3c9]">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge color={roleColor(m.role)}>{m.role}</Badge></td>
                  <td className="px-4 py-3">
                    {m.status === "active" ? <Badge color="green">active</Badge>
                      : m.status === "invited" ? <Badge color="amber">invited</Badge>
                      : <Badge color="red">suspended</Badge>}
                  </td>
                  <td className="px-4 py-3">{m.twoFA ? <Badge color="green">enabled</Badge> : <Badge color="amber">pending</Badge>}</td>
                  <td className="px-4 py-3"><div className="max-w-[320px] truncate text-xs">{m.scopes.join(", ")}</div></td>
                  <td className="px-4 py-3">{m.lastSeen}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditing(m)}><Shield className="mr-2 h-4 w-4" /> Edit Access</Button>
                      <Button variant="outline" onClick={() => alert(JSON.stringify(m, null, 2))}><Eye className="mr-2 h-4 w-4" /> View</Button>
                      <Button variant="destructive" onClick={() => revokeMember(m.id)}><Trash2 className="mr-2 h-4 w-4" /> Revoke</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Optional: your InviteDialog and EditAccessSheet components can be copied here exactly as before */}
    </div>
  );
}
