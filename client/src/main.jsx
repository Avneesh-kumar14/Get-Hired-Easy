import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from './store/appStore.js'; 

// Suppress network error logs that contain localhost or API paths
const originalError = console.error;
console.error = function(...args) {
  const errorString = args.join(" ");
  // Don't log errors that contain localhost or HTTP API details
  if (!errorString.includes("localhost") && 
      !errorString.includes("http://") && 
      !errorString.includes("https://") &&
      !errorString.includes("/api/")) {
    originalError.apply(console, args);
  }
};

// Suppress "Failed to load resource" warnings from being too verbose
window.addEventListener("error", (event) => {
  if (event.message?.includes("Failed to load resource")) {
    event.preventDefault();
    return false;
  }
}, true);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </StrictMode>
);
