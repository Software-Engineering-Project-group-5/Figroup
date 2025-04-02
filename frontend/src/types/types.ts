export interface User {
    _id: string;
    name: string;
    email: string;
    groups: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Group {
    _id: string;
    name: string;
    type: 'EXPENSE' | 'INVESTMENT';
    admin_id: string;
    members: string[];
    expenses: string[];
    investments: string[];
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Expense {
    _id: string;
    group_id: string;
    payer_id: string;
    amount: number;
    description: string;
    split_type: 'EQUAL' | 'CUSTOM';
    split_details: Record<string, number>;
    createdAt?: string;
  }
  
  export interface Investment {
    _id: string;
    group_id: string;
    stock_symbol: string;
    total_invested: number;
    shares_bought: number;
    current_value: number;
    createdAt?: string;
  }
  
  export interface Contribution {
    _id: string;
    investment_id: string;
    user_id: string;
    amount: number;
    createdAt?: string;
  }
  
  export interface Settlement {
    _id: string;
    group_id: string;
    from_user_id: string;
    to_user_id: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED';
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Balance {
    _id: string;
    group_id: string;
    user_id: string;
    balances: Record<string, number>;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface UserSummary {
    group_id: string;
    group_name: string;
    total_owed: number;
    total_to_receive: number;
    owes_to: Array<{ user_id: string; amount: number }>;
    gets_from: Array<{ user_id: string; amount: number }>;
  }
  
  export interface GroupReport {
    group_id: string;
    total_expenses: number;
    total_investments: number;
    members: User[];
    expenses: Expense[];
    investments: Investment[];
  }
  
  export interface InvestmentPerformance {
    current_value: number;
    profit_loss: number;
  }