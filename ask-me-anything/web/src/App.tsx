import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import Room from "./pages/Room";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/query/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />,
  },
  {
    path: "/room/:roomId",
    element: <Room />,
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster invert richColors />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
