import type { Route } from './+types/dashboard'
import { Car } from "lucide-react";
import { redirect } from "react-router";
import AddInstitutionButton from '~/components/addItemBtn';
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card"
import { ensureAuthenticated, getUserItems } from "~/lib/data-access";
import type { Account, UserItem } from "~/lib/definitions"

export async function loader({ request }: {request: Request}) {
  const isAuthenticated = await ensureAuthenticated(request)
  
  if(!isAuthenticated) {
    return redirect('/')
  }
  
  const items = await getUserItems(request)
  
  return { items: items }
}

export default function Dashaboard({ loaderData }: Route.ComponentProps) {
  
  const { items } = loaderData as { items: UserItem[] }
  
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12">
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Net Worth Tracker</h1>
      
      {/* Total Net Worth Card  */}
      <NetWorthCard netWorthData={items} />
      
      {/* Add Institution Button */}
      <AddInstitutionButton />
      
      {/* Institution List */}
      <div className="space-y-6">
        {items.map((institution) => (
          <InstitutionList key={institution.item_id} institution={institution} />
        ))}
      </div>
    </div>
  )
}

const NetWorthCard = ({ netWorthData }: { netWorthData: UserItem[] }) => {
  
  // Calculate the total net worth by summing up the current_balance of each account
  const totalNetWorth = netWorthData.reduce((total, institution) => {
    institution.accounts.forEach((account) => {
      total += account.balance.current_balance || 0;
    });
    return total
  }, 0.00)
  
  return (
    <Card className="bg-gradient-to-t from-indigo-600 to-blue-500 text-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-semibold">Total Net Worth</h3>
      <p className="text-4xl mt-2 font-medium">
        ${totalNetWorth.toLocaleString()}
      </p>
    </Card>
  )
};

const InstitutionList = ({ institution }: { institution: UserItem }) => {
  return (
    <Card className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-2xl font-semibold text-gray-900">{institution.institution_name}</h2>
      <div className="mt-4 space-y-4">
        {institution.accounts.map((account) => (
          <AccountCard key={account.account_id} account={account} />
        ))}
      </div>
    </Card>
  )
}

const AccountCard = ({ account }: { account: Account}) => {
  const { account_name, account_type, balance, mask } = account;

  return (
    <Card className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-lg text-gray-800">{account_name}</h4>
          <p className="text-sm text-gray-500">{account_type}</p>
        </div>
        <p className="text-xl text-gray-900 font-medium">
          ${balance.current_balance?.toLocaleString() || "0.00"}
        </p>
      </div>
      <p className="text-sm text-gray-400 mt-2">Account Mask: {mask}</p>
      {balance.iso_currency_code && (
        <p className="text-xs text-gray-500 mt-1">Currency: {balance.iso_currency_code}</p>
      )}
    </Card>
  );
};