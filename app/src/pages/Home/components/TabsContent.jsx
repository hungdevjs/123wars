import { useState } from 'react';

import TabSwap from './TabSwap';
import TabHistory from './TabHistory';
import TabAnalytics from './TabAnalytics';

const tabs = [
  { key: 'analytics', name: 'Analytics', component: TabAnalytics },
  { key: 'my-bet', name: 'My bet', component: TabHistory },
  { key: 'swap', name: 'Swap', component: TabSwap },
];

const TabsContent = () => {
  const [activeTabKey, setActiveTabKey] = useState(localStorage.getItem('active_tab_key') || 'my-bet');

  const activeTab = tabs.find((tab) => tab.key === activeTabKey);

  const changeTab = (key) => {
    localStorage.setItem('active_tab_key', key);
    setActiveTabKey(key);
  };

  const TabComponent = activeTab.component;

  return (
    <div className="h-full flex flex-col">
      <div className="w-full overflow-auto p-2 border-b border-gray-800 flex items-center gap-4">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab.key;
          return (
            <div key={tab.key}>
              <p
                className={`cursor-pointer ${isActive ? 'text-white' : 'text-gray-400'}`}
                onClick={() => changeTab(tab.key)}>
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
