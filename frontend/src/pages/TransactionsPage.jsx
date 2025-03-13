import TransactionList from '../components/TransactionList';

const TransactionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>
      <TransactionList />
    </div>
  );
};

export default TransactionsPage; 