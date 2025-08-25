export type Role =
  | "owner"
  | "admin"
  | "accountant"
  | "support"
  | "developer"
  | "sales"
  | "viewer";

export type PermissionKey =
  // Transactions
  | "transactions.view"
  | "transactions.exportCsv"
  | "refund.issue"
  | "void.sameDay"
  // Disputes
  | "disputes.view"
  | "disputes.submitEvidence"
  // Payouts/Balance
  | "balance.view"
  | "payouts.create"
  // Settlement
  | "settlement.view"
  | "settlement.manage"
  // Business/Fees/Team
  | "business.legal"
  | "business.branding"
  | "fees.change"
  | "team.invite"
  | "team.roleChange"
  // Developer
  | "apiKeys.view"
  | "apiKeys.manage"
  | "webhooks.view"
  | "webhooks.manage"
  | "logs.view"
  // Links / Invoices
  | "paymentLinks.view"
  | "paymentLinks.manage"
  | "invoices.view"
  | "invoices.create"
  // Modes
  | "mode.toggleView"
  | "mode.switch"
  // PII / Security
  | "pii.access"
  | "security.manage"
  | "org.delete";

export type Level = "allow" | "deny" | "masked" | "noPII" | "limit";

export type PermissionMeta = {
  key: PermissionKey;
  label: string;
  group: string;
  levels?: Level[];
  defaultLevel?: Level;
};

export type RolePolicy = Record<PermissionKey, Level>;
export type PolicySet = Record<Role, RolePolicy>;
