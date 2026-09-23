import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types";
import { tenantService } from "./tenant.service";

export class TenantController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await tenantService.getProfile(req.user.id);
      res.json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updatePersonalInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await tenantService.updatePersonalInfo(req.user.id, req.body);
      res.json({ success: true, message: "Personal info updated", data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updateEmploymentInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await tenantService.updateEmploymentInfo(req.user.id, req.body);
      res.json({ success: true, message: "Employment info updated", data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getCompletionStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = await tenantService.getCompletionStatus(req.user.id);
      res.json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }
}

export const tenantController = new TenantController();
