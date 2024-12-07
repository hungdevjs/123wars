import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import AppContainer from "./components/AppContainer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <AppContainer>
          <App />
        </AppContainer>
        <Toaster />
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);
