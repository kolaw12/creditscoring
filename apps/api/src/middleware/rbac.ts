import { Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/errors";
import { AuthenticatedRequest } from "../types";
import { UserRole } from "@prisma/client";

type Role = UserRole;

const roleHierarchy: Record<Role, Role[]> = {
  [UserRole.tenant]: [],
  [UserRole.admin]: [UserRole.tenant],
  [UserRole.credit_officer]: [UserRole.tenant],
  [UserRole.operations]: [UserRole.tenant],
  [UserRole.collections_officer]: [UserRole.tenant],
  [UserRole.finance]: [UserRole.tenant],
  [UserRole.super_admin]: [
    UserRole.tenant,
    UserRole.admin,
    UserRole.credit_officer,
    UserRole.operations,
    UserRole.collections_officer,
    UserRole.finance,
  ],
};

export function requireRole(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    const userRole = req.user.role as Role;

    // Check if user has one of the required roles
    if (roles.includes(userRole)) {
      next();
      return;
    }

    // Check if user has a higher role via hierarchy
    const inheritedRoles = roleHierarchy[userRole] || [];
    const hasAccess = roles.some((requiredRole) =>
      inheritedRoles.includes(requiredRole) || userRole === requiredRole
    );

    if (hasAccess) {
      next();
      return;
    }

    next(new ForbiddenError("Insufficient permissions"));
  };
}
