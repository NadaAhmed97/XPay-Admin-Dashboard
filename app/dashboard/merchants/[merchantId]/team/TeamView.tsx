"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  Copy,
  EllipsisVertical,
  Eye,
  KeyRound,
  MailPlus,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";

/** Minimal UI atoms (same styles you already use) */
const Button = ({ className = "", variant = "default", ...props }: any) => (
  <button
    className={
      "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm transition hover:shadow md:px-5 md:py-2.5 " +
      (variant === "outline"
        ? "border border-gray-400 bg-white text-gray-900"
        : variant === "ghost"
        ? "hover:bg-gray-100 text-gray-900"
        : variant === "destructive"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-black text-white hover:bg-gray-900") +
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
        ? "bg-blue-500 text-white"
        : "bg-slate-600 text-white")
    }
  >
    {children}
  </span>
);
const Input = (props: any) => (
  <input
    className="w-full rounded-xl border border-gray-400 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
    {...props}
  />
);
const Select = ({ value, onChange, children }: any) => (
  <select
    className="w-full rounded-xl border border-gray-400 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-black"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {children}
  </select>
);
const Card = ({ title, actions, children }: any) => (
  <div className="rounded-2xl border border-gray-300 bg-white p-4 shadow-sm md:p-6">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-base font-bold md:text-lg text-gray-900">{title}</h3>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

/** types */
const ROLES = ["owner", "admin", "accountant", "support", "developer", "sales", "viewer"] as const;
type Role = (typeof ROLES)[number];
type Member = {
  id: string; name: string; email: string; role: Role;
  status: "active" | "invited" | "suspended";
  twoFA: boolean; lastSeen: string; scopes: string[];
};
const roleColor = (r: Role) =>
  ({ owner:"blue", admin:"green", accountant:"amber", support:"slate", developer:"slate", sales:"slate", viewer:"slate" } as const)[r];

const SAMPLE_MEMBERS: Member[] = [
  { id:"u_01", name:"Nada Saeed", email:"nada@acme.co", role:"owner", status:"active", twoFA:true, lastSeen:"3m ago", scopes:["merchant:xp_9A2B-1C34"] },
  { id:"u_02", name:"Alaa Said", email:"alaa@acme.co", role:"accountant", status:"active", twoFA:true, lastSeen:"1h ago", scopes:["merchant:xp_9A2B-1C34"] },
  { id:"u_03", name:"NBE Observer", email:"team@nbe.com", role:"viewer", status:"active", twoFA:false, lastSeen:"—", scopes:["org:NBE:*"] },
];

export default function TeamView({ merchantId }: { merchantId: string }) {
  const [members, setMembers] = useState<Member[]>(SAMPLE_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  const handleInvite = (payload: { name: string; email: string; role: Role; scope: string }) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      status: "invited",
      twoFA: false,
      lastSeen: "—",
      scopes: [payload.scope],
    };
    setMembers((prev) => [newMember, ...prev]);
    setShowInvite(false);
  };
  const revokeMember = (id: string) => setMembers((prev) => prev.filter((m) => m.id !== id));
  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8 text-gray-900">
      <Card
        title="Team & Access"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowInvite(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Member
            </Button>
            <Button variant="ghost" title="More">
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </>
        }
      >
        <div className="overflow-hidden rounded-xl border border-gray-300">
          <table className="w-full text-left text-sm text-gray-900">
            <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-900 font-bold">
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
                <tr key={m.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-xs text-gray-800">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge color={roleColor(m.role)}>{m.role}</Badge></td>
                  <td className="px-4 py-3">
                    {m.status === "active" ? <Badge color="green">active</Badge>
                      : m.status === "invited" ? <Badge color="amber">invited</Badge>
                      : <Badge color="red">suspended</Badge>}
                  </td>
                  <td className="px-4 py-3">{m.twoFA ? <Badge color="green">enabled</Badge> : <Badge color="amber">pending</Badge>}</td>
                  <td className="px-4 py-3">
                    <div className="max-w-[320px] truncate text-xs" title={m.scopes.join(", ")}>{m.scopes.join(", ")}</div>
                  </td>
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

      {/* simple invite & edit UIs kept from your original — trimmed for brevity */}
      {showInvite && (
        <InviteDialog onClose={() => setShowInvite(false)} onInvite={handleInvite} merchantId={merchantId} />
      )}
      {editing && (
        <EditAccessSheet member={editing} onClose={() => setEditing(null)} onSave={updateMember} />
      )}
    </div>
  );
}

/** Invite dialog */
function InviteDialog({
  onClose,
  onInvite,
  merchantId,
}: {
  onClose: () => void;
  onInvite: (p: { name: string; email: string; role: Role; scope: string }) => void;
  merchantId: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [scope, setScope] = useState<string>(`merchant:${merchantId}`);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold text-gray-900">Invite Member</h4>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="grid gap-3">
          <div><label className="mb-1 block text-xs font-medium">Name</label><Input value={name} onChange={(e:any)=>setName(e.target.value)} placeholder="Full name" /></div>
          <div><label className="mb-1 block text-xs font-medium">Email</label><Input value={email} onChange={(e:any)=>setEmail(e.target.value)} type="email" placeholder="name@company.com" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-xs font-medium">Role</label>
              <Select value={role} onChange={setRole}>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</Select>
            </div>
            <div><label className="mb-1 block text-xs font-medium">Scope</label>
              <Input value={scope} onChange={(e:any)=>setScope(e.target.value)} placeholder={`merchant:${merchantId}`} />
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={()=>onInvite({name,email,role,scope})}><MailPlus className="mr-2 h-4 w-4" /> Send Invite</Button>
        </div>
      </div>
    </div>
  );
}

/** Edit sheet (trimmed) */
function EditAccessSheet({
  member, onClose, onSave,
}: { member: Member; onClose: () => void; onSave: (m: Member)=>void }) {
  const [role, setRole] = useState<Role>(member.role);
  const [scopesStr, setScopesStr] = useState(member.scopes.join(","));
  const [suspend, setSuspend] = useState(member.status === "suspended");
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center">
      <div className="h-[85%] w-full max-w-2xl rounded-t-2xl bg-white p-6 shadow-2xl md:h-auto md:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div><h4 className="text-lg font-bold">Edit Access</h4><p className="text-xs">{member.name} • {member.email}</p></div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="mb-1 block text-xs font-medium">Role</label>
              <Select value={role} onChange={setRole}>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}</Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Scopes</label>
              <Input value={scopesStr} onChange={(e:any)=>setScopesStr(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input id="suspend" type="checkbox" checked={suspend} onChange={(e)=>setSuspend(e.target.checked)} />
            <label htmlFor="suspend" className="text-sm">Suspend access</label>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="destructive" onClick={()=>onSave({...member, status:"suspended"})}>Revoke Access</Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={()=>onSave({...member, role, scopes: scopesStr.split(/\s*,\s*/), status: suspend ? "suspended":"active"})}>
              <Check className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
