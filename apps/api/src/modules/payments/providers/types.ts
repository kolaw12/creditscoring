export interface InitializePaymentInput {
  amount: number; // in kobo (multiply NGN by 100)
  email: string;
  reference: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface VerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      bin: string;
      bank: string;
      reusable: boolean;
    };
  };
}

export interface CreateTransferRecipientInput {
  type: "nuban";
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}

export interface CreateTransferRecipientResponse {
  status: boolean;
  message: string;
  data: {
    active: boolean;
    id: number;
    name: string;
    account_number: string;
    bank_id: number;
    currency: string;
    type: string;
    recipient_code: string;
    is_deleted: boolean;
  };
}

export interface InitiateTransferInput {
  amount: number; // in kobo
  recipient: string; // recipient_code
  reference: string;
  reason?: string;
  currency?: string;
}

export interface InitiateTransferResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    amount: number;
    currency: string;
    source: string;
    reason: string | null;
    recipient: number;
    status: string;
    transfer_code: string;
    created_at: string;
  };
}

export interface PaymentProvider {
  name: string;
  initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResponse>;
  verifyPayment(reference: string): Promise<VerifyPaymentResponse>;
  createTransferRecipient(input: CreateTransferRecipientInput): Promise<CreateTransferRecipientResponse>;
  initiateTransfer(input: InitiateTransferInput): Promise<InitiateTransferResponse>;
  verifyWebhookSignature(payload: string | Buffer, signature: string): boolean;
}
