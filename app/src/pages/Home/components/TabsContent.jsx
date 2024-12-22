import { useState } from 'react';

import TabGamePanel from './TabGamePanel';
import TabSwap from './TabSwap';
import TabHistory from './TabHistory';

const tabs = [
  { key: 'game', name: 'game', component: TabGamePanel },
  { key: 'my-bet', name: 'my bet', component: TabHistory },
  { key: 'swap', name: 'swap', component: TabSwap },
];

const TabsContent = () => {
  const [activeTabKey, setActiveTabKey] = useState(localStorage.getItem('active_tab_key') || 'game');

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);

  const changeTab = (key) => {
    localStorage.setItem('active_tab_key', key);
    setActiveTabKey(key);
  };

  const TabComponent = activeTab.component;

  return (
    <div className="h-full flex flex-col">
      <div className="w-full overflow-auto py-2 border-b border-gray-800 flex items-center gap-4">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab.key;
          return (
            <div key={tab.key}>
              <p
                className={`cursor-pointer ${isActive ? 'text-white' : 'text-gray-400'}`}
                onClick={() => changeTab(tab.key)}
              >
                {tab.name}
              </p>
            </div>
          );
        })}
      </div>
      <div className="overflow-auto">
        <TabComponent />
      </div>
    </div>
  );
};

export default TabsContent;
