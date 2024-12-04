import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from 'thirdweb/react';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import ActiveReward from './components/ActiveReward.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <App />
        <ActiveReward />
        <Toaster />
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);
