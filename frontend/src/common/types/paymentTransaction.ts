
export type ApplicationDetails = {
    applicationId: string;
    transactionAmount: number;
}

export type PaymentTransaction = {
    pgTransactionId: string;
    pgApproved: number;
    pgAuthCode: string;
    pgCardType: string;
    pgTransactionDate: string;
    pgCvdId: number;
    pgPaymentMethod: string;
    pgMessageId: number;
    pgMessageText: string;
    transactionId: string;
    totalTransactionAmount: number;
    applicationDetails: Array<ApplicationDetails>;
};
