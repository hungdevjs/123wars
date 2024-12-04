import useActiveData from './hooks/useActiveData';
import Navigations from './navigations';

const App = () => {
  useActiveData();

  return <Navigations />;
};

export default App;
