import Layout from '../../components/Layout';
import LogItem from './components/LogItem';
import useTransaction from './hooks/useTransaction';

const History = () => {
  const { transactions } = useTransaction();

  return (
    <Layout title="Game logs">
      <div className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <LogItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </Layout>
  );
};

export default History;
