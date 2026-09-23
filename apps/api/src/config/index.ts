import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Find .env by walking up from cwd
function findEnvFile(): string {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, "../../../.env"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

dotenv.config({ path: findEnvFile() });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string = ""): string {
  return process.env[key] || fallback;
}

export const config = {
  env: optionalEnv("NODE_ENV", "development"),
  port: parseInt(optionalEnv("PORT", "5000"), 10),
  apiUrl: optionalEnv("API_URL", "http://localhost:5000"),
  frontendUrl: optionalEnv("FRONTEND_URL", "http://localhost:3000"),

  database: {
    url: requireEnv("DATABASE_URL"),
  },

  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: optionalEnv("JWT_EXPIRES_IN", "15m"),
    refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
    refreshExpiresIn: optionalEnv("JWT_REFRESH_EXPIRES_IN", "7d"),
  },

  paystack: {
    secretKey: optionalEnv("PAYSTACK_SECRET_KEY"),
    publicKey: optionalEnv("PAYSTACK_PUBLIC_KEY"),
    webhookSecret: optionalEnv("PAYSTACK_WEBHOOK_SECRET"),
  },

  flutterwave: {
    secretKey: optionalEnv("FLUTTERWAVE_SECRET_KEY"),
    publicKey: optionalEnv("FLUTTERWAVE_PUBLIC_KEY"),
    webhookSecret: optionalEnv("FLUTTERWAVE_WEBHOOK_SECRET"),
  },

  aws: {
    accessKeyId: optionalEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: optionalEnv("AWS_SECRET_ACCESS_KEY"),
    region: optionalEnv("AWS_REGION", "us-east-1"),
    s3Bucket: optionalEnv("AWS_S3_BUCKET", "rentfin-documents"),
  },

  email: {
    provider: optionalEnv("EMAIL_PROVIDER", "smtp"),
    smtpHost: optionalEnv("SMTP_HOST"),
    smtpPort: parseInt(optionalEnv("SMTP_PORT", "587"), 10),
    smtpUser: optionalEnv("SMTP_USER"),
    smtpPass: optionalEnv("SMTP_PASS"),
    from: optionalEnv("EMAIL_FROM", "noreply@rentfin.ng"),
  },

  sms: {
    provider: optionalEnv("SMS_PROVIDER", "termii"),
    apiKey: optionalEnv("SMS_API_KEY"),
    senderId: optionalEnv("SMS_SENDER_ID"),
  },

  redis: {
    url: optionalEnv("REDIS_URL", "redis://localhost:6379"),
  },

  rateLimit: {
    windowMs: parseInt(optionalEnv("RATE_LIMIT_WINDOW_MS", "900000"), 10),
    maxRequests: parseInt(optionalEnv("RATE_LIMIT_MAX_REQUESTS", "100"), 10),
  },

  encryption: {
    key: optionalEnv("ENCRYPTION_KEY"),
  },
} as const;
