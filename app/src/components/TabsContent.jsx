import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';

import ConnectWalletButton from './ConnectWalletButton';
import TabAccount from './TabAccount';
import TabSwap from './TabSwap';
import TabHistory from './TabHistory';
import TabTransaction from './TabTransaction';
import TabChat from './TabChat';

const tabs = [
  { key: 'account', name: 'Account', component: TabAccount },
  { key: 'transaction', name: 'Transaction', component: TabTransaction },
  { key: 'swap', name: 'Swap', component: TabSwap },
  { key: 'history', name: 'History', component: TabHistory },
  { key: 'chat', name: 'Chat', component: TabChat },
];

const TabsContent = () => {
  const activeAccount = useActiveAccount();
  const [activeTabKey, setActiveTabKey] = useState(localStorage.getItem('active_tab_key') || 'account');

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);

  const changeTab = (key) => {
    localStorage.setItem('active_tab_key', key);
    setActiveTabKey(key);
  };

  if (!activeAccount)
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-1">
        <p className="text-lg">Login to see account detail</p>
        <ConnectWalletButton />
      </div>
    );

  const TabComponent = activeTab.component;

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-[57px] overflow-auto p-4 border-b flex items-center gap-4">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab.key;
          return (
            <div key={tab.key}>
              <p
                className={`cursor-pointer font-medium ${
                  isActive ? 'text-black' : 'text-gray-400'
                } transition duration-300 hover:text-gray-800`}
                onClick={() => changeTab(tab.key)}
              >
                {tab.name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="overflow-auto" style={{ height: 'calc(100% - 57px)' }}>
        <TabComponent />
      </div>
    </div>
  );
};

export default TabsContent;
