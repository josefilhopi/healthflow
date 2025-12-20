import React from "react"; // Adicionado: Importar React
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/layout/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="class" enableSystem>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);