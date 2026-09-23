import crypto from "crypto";
import { config } from "../../../config";
import {
  PaymentProvider,
  InitializePaymentInput,
  InitializePaymentResponse,
  VerifyPaymentResponse,
  CreateTransferRecipientInput,
  CreateTransferRecipientResponse,
  InitiateTransferInput,
  InitiateTransferResponse,
} from "./types";
import { BadRequestError } from "../../../utils/errors";
import logger from "../../../utils/logger";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

async function paystackRequest<T>(
  path: string,
  method: string = "GET",
  body?: Record<string, unknown>
): Promise<T> {
  const url = `${PAYSTACK_BASE_URL}${path}`;
  const headers = {
    Authorization: `Bearer ${config.paystack.secretKey}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data: any = await response.json();

  if (!data.status) {
    logger.error("Paystack API error", { path, status: data.status, message: data.message });
    throw new BadRequestError(data.message || "Payment provider error");
  }

  return data as T;
}

export class PaystackProvider implements PaymentProvider {
  name = "paystack";

  async initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResponse> {
    return paystackRequest<InitializePaymentResponse>("/transaction/initialize", "POST", {
      amount: input.amount,
      email: input.email,
      reference: input.reference,
      callback_url: input.callback_url,
      metadata: input.metadata,
    });
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    return paystackRequest<VerifyPaymentResponse>(`/transaction/verify/${reference}`);
  }

  async createTransferRecipient(
    input: CreateTransferRecipientInput
  ): Promise<CreateTransferRecipientResponse> {
    return paystackRequest<CreateTransferRecipientResponse>(
      "/transferrecipient",
      "POST",
      {
        type: input.type,
        name: input.name,
        account_number: input.account_number,
        bank_code: input.bank_code,
        currency: input.currency || "NGN",
      }
    );
  }

  async initiateTransfer(input: InitiateTransferInput): Promise<InitiateTransferResponse> {
    return paystackRequest<InitiateTransferResponse>("/transfer", "POST", {
      amount: input.amount,
      recipient: input.recipient,
      reference: input.reference,
      reason: input.reason,
      currency: input.currency || "NGN",
    });
  }

  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean {
    if (!config.paystack.webhookSecret) {
      logger.warn("Paystack webhook secret not configured");
      return false;
    }

    const hash = crypto
      .createHmac("sha512", config.paystack.webhookSecret)
      .update(payload)
      .digest("hex");

    return hash === signature;
  }
}

// Mock provider for development/testing
export class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResponse> {
    logger.info("MOCK: Initialize payment", { reference: input.reference, amount: input.amount });
    return {
      status: true,
      message: "Payment initialized (mock)",
      data: {
        authorization_url: `https://pay.mock/test?reference=${input.reference}`,
        access_code: `mock_${input.reference}`,
        reference: input.reference,
      },
    };
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    logger.info("MOCK: Verify payment", { reference });
    return {
      status: true,
      message: "Payment verified (mock)",
      data: {
        id: Date.now(),
        domain: "test",
        status: "success",
        reference,
        amount: 100000,
        message: null,
        gateway_response: "Successful",
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        channel: "card",
        currency: "NGN",
        ip_address: "127.0.0.1",
        metadata: {},
        customer: { id: 1, first_name: "Test", last_name: "User", email: "test@test.com" },
        authorization: {
          authorization_code: "mock_auth",
          card_type: "visa",
          last4: "4242",
          exp_month: "12",
          exp_year: "2030",
          bin: "424242",
          bank: "TEST",
          reusable: true,
        },
      },
    };
  }

  async createTransferRecipient(
    input: CreateTransferRecipientInput
  ): Promise<CreateTransferRecipientResponse> {
    logger.info("MOCK: Create transfer recipient", { name: input.name });
    return {
      status: true,
      message: "Recipient created (mock)",
      data: {
        active: true,
        id: Date.now(),
        name: input.name,
        account_number: input.account_number,
        bank_id: 1,
        currency: "NGN",
        type: "nuban",
        recipient_code: `mock_recipient_${Date.now()}`,
        is_deleted: false,
      },
    };
  }

  async initiateTransfer(input: InitiateTransferInput): Promise<InitiateTransferResponse> {
    logger.info("MOCK: Initiate transfer", { reference: input.reference, amount: input.amount });
    return {
      status: true,
      message: "Transfer initiated (mock)",
      data: {
        id: Date.now(),
        domain: "test",
        amount: input.amount,
        currency: "NGN",
        source: "balance",
        reason: input.reason || null,
        recipient: 1,
        status: "success",
        transfer_code: `mock_transfer_${Date.now()}`,
        created_at: new Date().toISOString(),
      },
    };
  }

  verifyWebhookSignature(_payload: string | Buffer, _signature: string): boolean {
    return true;
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (config.env === "development" && !config.paystack.secretKey) {
    logger.info("Using mock payment provider (no Paystack keys configured)");
    return new MockPaymentProvider();
  }
  return new PaystackProvider();
}
