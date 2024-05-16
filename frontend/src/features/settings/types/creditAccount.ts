export const CREDIT_ACCOUNT_LIMITS = {
    PREPAID: "PREPAID",
    500: "500",
    1000: "1000",
    2000: "2000",
    10000: "10000",
    20000: "20000",
    30000: "30000",
    40000: "40000",
    50000: "50000",
    60000: "60000",
    70000: "70000",
    80000: "80000",
    90000: "90000",
    100000: "100000",
} as const;

export type CreditAccountLimitType = (typeof CREDIT_ACCOUNT_LIMITS)[keyof typeof CREDIT_ACCOUNT_LIMITS];

export const DEFAULT_CREDIT_ACCOUNT_LIMIT = "select";
export const EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT = "select";


export const CREDIT_ACCOUNT_LIMIT_CHOOSE_FROM_OPTIONS = [
    { value: EMPTY_CREDIT_ACCOUNT_LIMIT_SELECT, label: "Select" },
    { value: CREDIT_ACCOUNT_LIMITS.PREPAID, label: "Prepaid" },
    { value: CREDIT_ACCOUNT_LIMITS[500], label: "$500" },
    { value: CREDIT_ACCOUNT_LIMITS[1000], label: "$1000" },
    { value: CREDIT_ACCOUNT_LIMITS[2000], label: "$2000" },
    { value: CREDIT_ACCOUNT_LIMITS[10000], label: "$10000" },
    { value: CREDIT_ACCOUNT_LIMITS[20000], label: "$20000" },
    { value: CREDIT_ACCOUNT_LIMITS[30000], label: "$30000" },
    { value: CREDIT_ACCOUNT_LIMITS[40000], label: "$40000" },
    { value: CREDIT_ACCOUNT_LIMITS[50000], label: "$50000" },
    { value: CREDIT_ACCOUNT_LIMITS[60000], label: "$60000" },
    { value: CREDIT_ACCOUNT_LIMITS[70000], label: "$70000" },
    { value: CREDIT_ACCOUNT_LIMITS[80000], label: "$80000" },
    { value: CREDIT_ACCOUNT_LIMITS[90000], label: "$90000" },
    { value: CREDIT_ACCOUNT_LIMITS[100000], label: "$100,000" }
];
