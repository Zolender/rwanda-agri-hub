import prisma from "@/app/lib/db";
import { AuditAction } from "@/app/generated/prisma/enums";
// ── logAction ──────────────────────────────────────────────────────────────────
// Call this inside any server action after a successful mutation.
// It never throws — if logging fails we don't want it to break the actual action.
//
// Usage:
//   await logAction({
//       userId:     session.user.id,
//       userEmail:  session.user.email,
//       userRole:   session.user.role,
//       action:     AuditAction.CREATE_USER,
//       targetId:   newUser.id,
//       targetType: "User",
//       detail:     `Created user ${data.email} with role ${data.role}`,
//   });

type LogActionInput = {
    userId?:     string | null;
    userEmail?:  string | null;
    userRole?:   string | null;
    action:      AuditAction;
    targetId?:   string | null;
    targetType?: string | null;
    detail?:     string | null;
};

export async function logAction(input: LogActionInput): Promise<void> {
    try {
        await prisma.auditLog.create({ data: input });
    } catch (err) {
        // Log to console but never propagate — audit failure ≠ action failure
        console.error("[AuditLog] Failed to write log entry:", err);
    }
}