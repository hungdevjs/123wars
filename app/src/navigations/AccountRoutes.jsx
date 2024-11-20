import { Routes, Route, Navigate } from 'react-router-dom';

import Account from '../pages/Account';
import Plan from '../pages/Account/Plan';
import Activity from '../pages/Account/Activity';

const AccountRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Account />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/activities" element={<Activity />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AccountRoutes;
