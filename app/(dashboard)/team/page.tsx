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

/** Minimal UI helpers */
const Button = ({ className = "", variant = "default", ...props }: any) => (
  <button
    className={
      "rounded-2xl px-4 py-2 text-sm shadow-sm transition hover:shadow md:px-5 md:py-2.5 " +
      (variant === "outline"
        ? "border bborder-[#2a3244] bg-[#131621]"
        : variant === "ghost"
        ? "hover:bg-gray-800"
        : variant === "destructive"
        ? "bg-red-600 text-white hover:bg-red-700"
        : "bg-[#4a46ff] text-white hover:bg-[#3e3bff]") +
      (className ? " " + className : "")
    }
    {...props}
  />
);
const Badge = ({ children, color = "slate" }: any) => (
  <span
    className={
      `inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ` +
      (color === "green"
        ? "bg-green-100 text-green-700"
        : color === "amber"
        ? "bg-amber-100 text-amber-700"
        : color === "red"
        ? "bg-red-100 text-red-700"
        : color === "blue"
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-700")
    }
  >
    {children}
  </span>
);
const Input = (props: any) => (
  <input
    className="w-full rounded-xl border border-[#2a3244] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
    {...props}
  />
);
const Select = ({ value, onChange, children }: any) => (
  <select
    className="w-full rounded-xl border border-[#2a3244] bg-[#131621] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {children}
  </select>
);
const Card = ({ title, actions, children }: any) => (
  <div className="rounded-2xl border border-gray-800 bg-[#131621] p-4 shadow-sm md:p-6">
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-base font-semibold md:text-lg">{title}</h3>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    {children}
  </div>
);

/** Roles & types */
const ROLES = [
  "owner",
  "admin",
  "accountant",
  "support",
  "developer",
  "sales",
  "viewer",
] as const;
type Role = (typeof ROLES)[number];

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  twoFA: boolean;
  lastSeen: string;
  scopes: string[]; // e.g. ["merchant:xp_..."] or ["org:NBE:*"]
};

type Merchant = {
  id: string;
  name: string;
  status: "active" | "disabled" | "test";
  createdAt: string;
  plan: "Starter" | "Growth" | "Enterprise";
};

const sampleMerchant: Merchant = {
  id: "xp_9A2B-1C34",
  name: "Acme Co.",
  status: "active",
  createdAt: "2024-11-07",
  plan: "Growth",
};
const sampleMembers: Member[] = [
  {
    id: "u_01",
    name: "Nada Saeed",
    email: "nada@acme.co",
    role: "owner",
    status: "active",
    twoFA: true,
    lastSeen: "3m ago",
    scopes: ["merchant:xp_9A2B-1C34"],
  },
  {
    id: "u_02",
    name: "Alaa Said",
    email: "alaa@acme.co",
    role: "accountant",
    status: "active",
    twoFA: true,
    lastSeen: "1h ago",
    scopes: ["merchant:xp_9A2B-1C34"],
  },
  {
    id: "u_03",
    name: "NBE Observer",
    email: "team@nbe.com",
    role: "viewer",
    status: "active",
    twoFA: false,
    lastSeen: "—",
    scopes: ["org:NBE:*"],
  },
];

const roleColor = (r: Role) =>
  ({
    owner: "blue",
    admin: "green",
    accountant: "amber",
    support: "slate",
    developer: "slate",
    sales: "slate",
    viewer: "slate",
  } as const)[r];

export default function AccessManagementPage() {
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  const owners = useMemo(
    () => members.filter((m) => m.role === "owner"),
    [members]
  );

  const handleInvite = (payload: {
    name: string;
    email: string;
    role: Role;
    scope: string;
  }) => {
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

  const revokeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      {/* Merchant Header */}
      <Card
        title="Merchant Overview"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(sampleMerchant.id)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Merchant ID
            </Button>
            <Badge
              color={
                sampleMerchant.status === "active"
                  ? "green"
                  : sampleMerchant.status === "test"
                  ? "amber"
                  : "red"
              }
            >
              {sampleMerchant.status}
            </Badge>
          </div>
        }
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-gray-800">Merchant ID</p>
            <p className="font-medium">{sampleMerchant.id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-800">Merchant Name</p>
            <p className="font-medium">{sampleMerchant.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-800">Plan</p>
            <p className="font-medium">{sampleMerchant.plan}</p>
          </div>
          <div>
            <p className="text-xs text-gray-800">Created</p>
            <p className="font-medium">{sampleMerchant.createdAt}</p>
          </div>
        </div>
      </Card>

      {/* Team & Access */}
      <Card
        title="Team & Access"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowInvite(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Invite Member
            </Button>
            <Button variant="ghost">
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </>
        }
      >
        <div className="overflow-hidden rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700 text-xs uppercase tracking-wide text-gray-800">
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
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-gray-800">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={roleColor(m.role)}>{m.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {m.status === "active" ? (
                      <Badge color="green">active</Badge>
                    ) : m.status === "invited" ? (
                      <Badge color="amber">invited</Badge>
                    ) : (
                      <Badge color="red">suspended</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {m.twoFA ? (
                      <Badge color="green">enabled</Badge>
                    ) : (
                      <Badge color="amber">pending</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className="max-w-[260px] truncate text-xs text-[#aab2c8]"
                      title={m.scopes.join(", ")}
                    >
                      {m.scopes.join(", ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{m.lastSeen}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditing(m)}>
                        <Shield className="mr-2 h-4 w-4" /> Edit Access
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => alert(JSON.stringify(m, null, 2))}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => revokeMember(m.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Revoke
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Permissions summary */}
      <Card
        title="Role Permissions Summary"
        actions={
          <Button variant="outline">
            <KeyRound className="mr-2 h-4 w-4" /> Manage Policies
          </Button>
        }
      >
        <div className="grid gap-3 md:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r} className="rounded-xl border border-gray-800 p-4">
              <div className="mb-2 flex items-center justify-between">
                <Badge color={roleColor(r)}>{r}</Badge>
                <span className="text-xs text-gray-800">default policy</span>
              </div>
              <ul className="list-inside list-disc text-xs text-[#aab2c8]">
                {r === "admin" && (
                  <>
                    <li>Full management except delete org</li>
                    <li>Refunds/Void allowed</li>
                    <li>Fees & plans change</li>
                  </>
                )}
                {r === "accountant" && (
                  <>
                    <li>Exports (masked where needed)</li>
                    <li>Refunds up to limit</li>
                    <li>Payouts create</li>
                  </>
                )}
                {r === "viewer" && (
                  <>
                    <li>Read-only (strict masking)</li>
                    <li>CSV export (masked)</li>
                    <li>No money movement</li>
                  </>
                )}
                {r === "owner" && (
                  <>
                    <li>All permissions</li>
                    <li>Security & irreversible actions</li>
                  </>
                )}
                {r === "support" && (
                  <>
                    <li>View transactions/disputes</li>
                    <li>Submit dispute evidence</li>
                  </>
                )}
                {r === "developer" && (
                  <>
                    <li>API keys & webhooks</li>
                    <li>Switch Test/Live</li>
                  </>
                )}
                {r === "sales" && (
                  <>
                    <li>Payment links & invoices</li>
                    <li>Branding (text)</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {showInvite && (
        <InviteDialog
          onClose={() => setShowInvite(false)}
          onInvite={handleInvite}
          merchantId={sampleMerchant.id}
        />
      )}
      {editing && (
        <EditAccessSheet
          member={editing}
          onClose={() => setEditing(null)}
          onSave={updateMember}
        />
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
      <div className="w-full max-w-lg rounded-2xl bg-[#131621] p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold">Invite Member</h4>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-800">
              Name
            </label>
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-800">
              Email
            </label>
            <Input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-800">
                Role
              </label>
              <Select value={role} onChange={setRole}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-800">
                Scope
              </label>
              <Input
                value={scope}
                onChange={(e: any) => setScope(e.target.value)}
                placeholder={`merchant:${merchantId}`}
              />
              <p className="mt-1 text-[11px] text-gray-800">
                Examples: <code>merchant:{merchantId}</code>,{" "}
                <code>org:NBE:*</code>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onInvite({ name, email, role, scope })}>
            <MailPlus className="mr-2 h-4 w-4" /> Send Invite
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Edit access sheet (role/scopes/limit/suspend/revoke) */
function EditAccessSheet({
  member,
  onClose,
  onSave,
}: {
  member: Member;
  onClose: () => void;
  onSave: (m: Member) => void;
}) {
  const [role, setRole] = useState<Role>(member.role);
  const [limit, setLimit] = useState<string>("5000"); // example limit
  const [scopesStr, setScopesStr] = useState(member.scopes.join(","));
  const [suspend, setSuspend] = useState(member.status === "suspended");

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:items-center md:justify-center">
      <div className="h-[85%] w-full max-w-2xl rounded-t-2xl bg-[#131621] p-6 shadow-2xl md:h-auto md:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold">Edit Access</h4>
            <p className="text-xs text-gray-800">
              {member.name} • {member.email}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-800">
                Role
              </label>
              <Select value={role} onChange={setRole}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-800">
                Refund/Void limit (Accountant)
              </label>
              <Input value={limit} onChange={(e: any) => setLimit(e.target.value)} />
              <p className="mt-1 text-[11px] text-gray-800">
                Applies if role is <b>accountant</b>. Server enforces ceiling.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-800">
              Scopes
            </label>
            <Input
              value={scopesStr}
              onChange={(e: any) => setScopesStr(e.target.value)}
            />
            <p className="mt-1 text-[11px] text-gray-800">
              Comma-separated. Example: <code>merchant:xp_9A2B-1C34,org:NBE:*</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="suspend"
              type="checkbox"
              checked={suspend}
              onChange={(e) => setSuspend(e.target.checked)}
            />
            <label htmlFor="suspend" className="text-sm">
              Suspend access
            </label>
          </div>

          <div className="rounded-xl border border-gray-800 p-4">
            <p className="mb-2 text-sm font-semibold">Permission highlights</p>
            <ul className="list-inside list-disc text-xs text-gray-800">
              {role === "admin" && (
                <li>Manage team, refunds/void, payouts; cannot delete account.</li>
              )}
              {role === "accountant" && (
                <li>CSV export, refunds up to limit, create payouts.</li>
              )}
              {role === "viewer" && <li>Read-only; masked data; no finance ops.</li>}
              {role === "owner" && (
                <li>All permissions incl. security/irreversible actions.</li>
              )}
              {role === "support" && (
                <li>View transactions/disputes; submit evidence.</li>
              )}
              {role === "developer" && (
                <li>API keys/webhooks; switch Test/Live; no refunds.</li>
              )}
              {role === "sales" && <li>Payment links & invoices; branding text.</li>}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={() => onSave({ ...member, status: "suspended" })}
          >
            Revoke Access
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onSave({
                  ...member,
                  role,
                  scopes: scopesStr.split(/\s*,\s*/),
                  status: suspend ? "suspended" : "active",
                })
              }
            >
              <Check className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
