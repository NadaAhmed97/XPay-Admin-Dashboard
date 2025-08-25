import type {
  Level,
  PermissionMeta,
  PolicySet,
  RolePolicy,
} from "./types";

export const PERMISSIONS: PermissionMeta[] = [
  { key: "transactions.view", label: "Transactions – view", group: "Transactions", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "transactions.exportCsv", label: "Transactions – export CSV", group: "Transactions", levels: ["allow", "masked", "noPII", "deny"], defaultLevel: "masked" },
  { key: "refund.issue", label: "Refund / Partial Refund", group: "Transactions", levels: ["allow", "limit", "deny"], defaultLevel: "limit" },
  { key: "void.sameDay", label: "Void (same‑day)", group: "Transactions", levels: ["allow", "limit", "deny"], defaultLevel: "limit" },

  { key: "disputes.view", label: "Disputes – view", group: "Disputes", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "disputes.submitEvidence", label: "Disputes – submit evidence", group: "Disputes", levels: ["allow", "deny"], defaultLevel: "allow" },

  { key: "balance.view", label: "Balance / Payouts – view", group: "Payouts", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "payouts.create", label: "Payouts – create / trigger manual", group: "Payouts", levels: ["allow", "deny"], defaultLevel: "deny" },

  { key: "settlement.view", label: "Settlement Methods – view", group: "Settlement", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "settlement.manage", label: "Settlement Methods – add/edit/remove", group: "Settlement", levels: ["allow", "deny"], defaultLevel: "deny" },

  { key: "business.legal", label: "Business Settings – legal entity", group: "Settings", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "business.branding", label: "Business Settings – branding", group: "Settings", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "fees.change", label: "Fees & Plans – change (processing fees)", group: "Settings", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "team.invite", label: "Team – invite/remove members", group: "Settings", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "team.roleChange", label: "Team – change roles", group: "Settings", levels: ["allow", "deny"], defaultLevel: "deny" },

  { key: "apiKeys.view", label: "API Keys – view masked", group: "Developer", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "apiKeys.manage", label: "API Keys – create/rotate/restrict", group: "Developer", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "webhooks.view", label: "Webhooks – view", group: "Developer", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "webhooks.manage", label: "Webhooks – add/edit/disable", group: "Developer", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "logs.view", label: "Logs (Success/Failure) – view", group: "Developer", levels: ["allow", "deny"], defaultLevel: "allow" },

  { key: "paymentLinks.view", label: "Payment Links – view", group: "Links & Invoices", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "paymentLinks.manage", label: "Payment Links – create/edit", group: "Links & Invoices", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "invoices.view", label: "Invoices – view/download", group: "Links & Invoices", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "invoices.create", label: "Invoices – create/send", group: "Links & Invoices", levels: ["allow", "deny"], defaultLevel: "deny" },

  { key: "mode.toggleView", label: "Test Mode toggle (view)", group: "Modes", levels: ["allow", "deny"], defaultLevel: "allow" },
  { key: "mode.switch", label: "Test/Live switch (change)", group: "Modes", levels: ["allow", "deny"], defaultLevel: "deny" },

  { key: "pii.access", label: "PII access (cardholder details)", group: "Security & PII", levels: ["allow", "masked", "deny"], defaultLevel: "masked" },
  { key: "security.manage", label: "Security – 2FA enforcement / session policy", group: "Security & PII", levels: ["allow", "deny"], defaultLevel: "deny" },
  { key: "org.delete", label: "Delete account / irreversible actions", group: "Security & PII", levels: ["allow", "deny"], defaultLevel: "deny" },
];

// helper to build a flat policy
const all = (lvl: Level): RolePolicy =>
  Object.fromEntries(PERMISSIONS.map((p: PermissionMeta) => [p.key, lvl])) as RolePolicy;

export const DEFAULTS: PolicySet = {
  owner: {
    ...all("allow"),
    "transactions.exportCsv": "allow",
    "pii.access": "allow",
  },
  admin: {
    ...all("allow"),
    "org.delete": "deny",
    "business.legal": "allow",
    "fees.change": "allow",
    "transactions.exportCsv": "allow",
    "pii.access": "allow",
  },
  accountant: {
    ...all("deny"),
    "transactions.view": "allow",
    "transactions.exportCsv": "allow",
    "refund.issue": "limit",
    "void.sameDay": "limit",
    "disputes.view": "allow",
    "disputes.submitEvidence": "allow",
    "balance.view": "allow",
    "payouts.create": "allow",
    "settlement.view": "allow",
    "paymentLinks.view": "allow",
    "invoices.view": "allow",
    "invoices.create": "allow",
    "mode.toggleView": "allow",
    "pii.access": "masked",
    "logs.view": "allow",
  },
  support: {
    ...all("deny"),
    "transactions.view": "allow",
    "transactions.exportCsv": "masked",
    "disputes.view": "allow",
    "disputes.submitEvidence": "allow",
    "balance.view": "deny",
    "settlement.view": "allow",
    "paymentLinks.view": "allow",
    "invoices.view": "allow",
    "mode.toggleView": "allow",
    "pii.access": "masked",
    "logs.view": "allow",
  },
  developer: {
    ...all("deny"),
    "transactions.view": "allow",
    "balance.view": "allow",
    "apiKeys.view": "allow",
    "apiKeys.manage": "allow",
    "webhooks.view": "allow",
    "webhooks.manage": "allow",
    "logs.view": "allow",
    "mode.toggleView": "allow",
    "mode.switch": "allow",
    "paymentLinks.view": "allow",
    "invoices.view": "allow",
    "pii.access": "deny",
  },
  sales: {
    ...all("deny"),
    "transactions.view": "allow",
    "transactions.exportCsv": "noPII",
    "business.branding": "allow",
    "paymentLinks.view": "allow",
    "paymentLinks.manage": "allow",
    "invoices.view": "allow",
    "invoices.create": "allow",
    "mode.toggleView": "allow",
    "pii.access": "deny",
  },
  viewer: {
    ...all("deny"),
    "transactions.view": "allow",
    "transactions.exportCsv": "allow",
    "disputes.view": "allow",
    "settlement.view": "allow",
    "paymentLinks.view": "allow",
    "invoices.view": "allow",
    "mode.toggleView": "allow",
    "logs.view": "allow",
    "balance.view": "deny",
    "pii.access": "deny",
  },
};
