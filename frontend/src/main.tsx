import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import {createRouter, RouterProvider} from "@tanstack/react-router";

import {routeTree} from './routeTree.gen'
import {MantineProvider} from "@mantine/core";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
          <MantineProvider>
              <RouterProvider router={router}></RouterProvider>
          </MantineProvider>
      </QueryClientProvider>
    {/*<App />*/}
  </StrictMode>,
)
