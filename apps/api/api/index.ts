import app from "../src/app";
import prisma from "../src/database";
import logger from "../src/utils/logger";

export default async function handler(req: any, res: any) {
  try {
    await prisma.$connect();
  } catch (error) {
    logger.error("Failed to connect to database in serverless handler", error);
  }
  return app(req, res);
}
