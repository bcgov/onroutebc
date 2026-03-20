export interface IEGARMSResponse {
  PPABalance?: PPABalace;
}

interface PPABalace {
  return_code: string;
  account_balance: number;
  negative_limit: number;
  account_balance_timestamp: Date;
  message: string;
}
