import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import dayjs from "dayjs";

import { App } from "./app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/pt-br";

import "./index.css";

dayjs.locale("pt-br");

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
