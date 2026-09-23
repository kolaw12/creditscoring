import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { AuditAction } from "@prisma/client";
import prisma from "../database";

export function auditLog(action: AuditAction, entity?: string) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const entityId = req.params.id || req.body.id || undefined;

      await prisma.auditLog.create({
        data: {
          userId: req.user?.id,
          action,
          entity,
          entityId,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      });
    } catch {
      // Audit logging should never break the request flow
    }
    next();
  };
}
