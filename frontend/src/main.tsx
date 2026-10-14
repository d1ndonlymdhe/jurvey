import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import {createRouter, RouterProvider} from "@tanstack/react-router";

import {routeTree} from './routeTree.gen'
import {MantineProvider} from "@mantine/core";
import {Provider} from "react-redux";
import {store} from "./store.ts";
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <MantineProvider>
              <RouterProvider router={router}></RouterProvider>
          </MantineProvider>
      </Provider>
    {/*<App />*/}
  </StrictMode>,
)
