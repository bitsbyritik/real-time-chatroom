import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/jetbrains-mono";

import App from "./App.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>,
);
