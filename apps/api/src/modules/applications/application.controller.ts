import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types";
import { applicationService } from "./application.service";

export class ApplicationController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const application = await applicationService.createApplication(req.user.id, req.body);
      res.status(201).json({ success: true, message: "Application created", data: application });
    } catch (error) {
      next(error);
    }
  }

  async submit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const application = await applicationService.submitApplication(req.params.id, req.user.id);
      res.json({ success: true, message: "Application submitted", data: application });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const application = await applicationService.getApplication(req.params.id, req.user.id);
      res.json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }

  async getMyApplications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const applications = await applicationService.getUserApplications(req.user.id);
      res.json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, search } = req.query;
      const result = await applicationService.getAllApplications({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as any,
        search: search as string,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status, note } = req.body;
      const application = await applicationService.updateApplicationStatus(
        req.params.id,
        status,
        req.user.id,
        note
      );
      res.json({ success: true, message: `Application ${status}`, data: application });
    } catch (error) {
      next(error);
    }
  }
}

export const applicationController = new ApplicationController();
