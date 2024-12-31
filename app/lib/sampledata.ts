import type { UserItem } from "./definitions";

// src/data/netWorthData.js
export const netWorthData: UserItem[] = [
  {
    item_id: "1",
    institution_id: "1",
    institution_name: "Bank of America",
    accounts: [
      {
        account_id: "a1",
        account_name: "Checking Account",
        account_type: "Checking",
        account_subtype: null,
        mask: "XXXX1234",
        balance: {
          current_balance: 15000,
          available_balance: 15000,
          iso_currency_code: "USD",
          balance_limit: null
        }
      },
      {
        account_id: "a2",
        account_name: "Savings Account",
        account_type: "Savings",
        account_subtype: null,
        mask: "XXXX5678",
        balance: {
          current_balance: 50000,
          available_balance: 50000,
          iso_currency_code: "USD",
          balance_limit: null
        }
      }
    ]
  },
  {
    item_id: "2",
    institution_id: "2",
    institution_name: "Chase",
    accounts: [
      {
        account_id: "a1",
        account_name: "Credit Card",
        account_type: "Credit",
        account_subtype: null,
        mask: "XXXX4321",
        balance: {
          current_balance: -2500,
          available_balance: -2500,
          iso_currency_code: "USD",
          balance_limit: null
        }
      }
    ]
  }
];
