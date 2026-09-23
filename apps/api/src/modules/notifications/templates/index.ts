export interface NotificationTemplate {
  subject: string;
  body: string;
  smsBody?: string;
}

export interface TemplateData {
  firstName?: string;
  lastName?: string;
  applicationId?: string;
  loanNumber?: string;
  amount?: number;
  monthlyInstallment?: number;
  dueDate?: string;
  status?: string;
  [key: string]: unknown;
}

export const templates: Record<string, (data: TemplateData) => NotificationTemplate> = {
  welcome: (data) => ({
    subject: "Welcome to RentFin",
    body: `Hi ${data.firstName},\n\nWelcome to RentFin! Your account has been created successfully.\n\nYou can now complete your profile and apply for rent financing.\n\nBest regards,\nRentFin Team`,
  }),

  email_verification: (data) => ({
    subject: "Verify Your Email Address",
    body: `Hi ${data.firstName},\n\nPlease verify your email address by clicking the link below.\n\nThis link expires in 24 hours.\n\nBest regards,\nRentFin Team`,
  }),

  application_submitted: (data) => ({
    subject: "Application Submitted",
    body: `Hi ${data.firstName},\n\nYour rent financing application has been submitted successfully.\n\nApplication ID: ${data.applicationId}\n\nOur team will review your application and get back to you within 3-5 business days.\n\nBest regards,\nRentFin Team`,
    smsBody: `Hi ${data.firstName}, your RentFin application has been submitted. We'll review it shortly.`,
  }),

  application_approved: (data) => ({
    subject: "Application Approved!",
    body: `Hi ${data.firstName},\n\nGreat news! Your rent financing application has been approved.\n\nWe're preparing your financing offer. You'll receive it shortly.\n\nBest regards,\nRentFin Team`,
    smsBody: `Hi ${data.firstName}, your RentFin application has been approved! Check your email for details.`,
  }),

  application_declined: (data) => ({
    subject: "Application Update",
    body: `Hi ${data.firstName},\n\nAfter careful review, we're unable to approve your rent financing application at this time.\n\nIf you have questions, please contact our support team.\n\nBest regards,\nRentFin Team`,
  }),

  additional_info_required: (data) => ({
    subject: "Additional Information Required",
    body: `Hi ${data.firstName},\n\nWe need some additional information to process your application.\n\nPlease log in to your account to see the details and upload the required documents.\n\nBest regards,\nRentFin Team`,
  }),

  offer_created: (data) => ({
    subject: "Your Financing Offer is Ready",
    body: `Hi ${data.firstName},\n\nYour rent financing offer has been prepared.\n\nFinancing Amount: ₦${data.amount?.toLocaleString()}\nMonthly Installment: ₦${data.monthlyInstallment?.toLocaleString()}\n\nPlease log in to review and accept the offer.\n\nBest regards,\nRentFin Team`,
    smsBody: `Hi ${data.firstName}, your RentFin financing offer is ready! Log in to review.`,
  }),

  offer_accepted: (data) => ({
    subject: "Offer Accepted — Loan Created",
    body: `Hi ${data.firstName},\n\nYou've accepted the financing offer. Your loan has been created.\n\nLoan Number: ${data.loanNumber}\n\nWe'll process the disbursement to your landlord shortly.\n\nBest regards,\nRentFin Team`,
  }),

  disbursement_initiated: (data) => ({
    subject: "Disbursement in Progress",
    body: `Hi ${data.firstName},\n\nYour rent financing has been disbursed to your landlord.\n\nLoan Number: ${data.loanNumber}\nAmount: ₦${data.amount?.toLocaleString()}\n\nYour repayment schedule is now active.\n\nBest regards,\nRentFin Team`,
    smsBody: `Hi ${data.firstName}, your RentFin disbursement of ₦${data.amount?.toLocaleString()} has been sent to your landlord.`,
  }),

  repayment_reminder: (data) => ({
    subject: "Upcoming Repayment Reminder",
    body: `Hi ${data.firstName},\n\nThis is a reminder that your next repayment is due on ${data.dueDate}.\n\nAmount Due: ₦${data.amount?.toLocaleString()}\n\nPlease ensure sufficient funds in your account.\n\nBest regards,\nRentFin Team`,
    smsBody: `Reminder: Your RentFin repayment of ₦${data.amount?.toLocaleString()} is due on ${data.dueDate}.`,
  }),

  payment_successful: (data) => ({
    subject: "Payment Confirmed",
    body: `Hi ${data.firstName},\n\nYour payment of ₦${data.amount?.toLocaleString()} has been received and confirmed.\n\nLoan Number: ${data.loanNumber}\n\nThank you for your payment!\n\nBest regards,\nRentFin Team`,
    smsBody: `Payment confirmed! ₦${data.amount?.toLocaleString()} received for your RentFin loan.`,
  }),

  payment_failed: (data) => ({
    subject: "Payment Failed",
    body: `Hi ${data.firstName},\n\nYour payment of ₦${data.amount?.toLocaleString()} could not be processed.\n\nPlease try again or contact support if the issue persists.\n\nBest regards,\nRentFin Team`,
    smsBody: `Your RentFin payment of ₦${data.amount?.toLocaleString()} failed. Please try again.`,
  }),

  loan_completed: (data) => ({
    subject: "Loan Fully Repaid!",
    body: `Hi ${data.firstName},\n\nCongratulations! Your loan ${data.loanNumber} has been fully repaid.\n\nThank you for using RentFin. We hope to serve you again.\n\nBest regards,\nRentFin Team`,
    smsBody: `Congratulations ${data.firstName}! Your RentFin loan has been fully repaid. Thank you!`,
  }),
};

export function renderTemplate(templateName: string, data: TemplateData): NotificationTemplate {
  const templateFn = templates[templateName];
  if (!templateFn) {
    throw new Error(`Notification template not found: ${templateName}`);
  }
  return templateFn(data);
}
