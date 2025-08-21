import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-eqq3olqazv3dbccv.us.auth0.com"
    clientId="jRETzVRi3BU0SpDj1aIkI2iSEsULaeS5"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "VocabApp",
    }}
  >
    <StrictMode>
      <QueryClientProvider client={queryClient}>
      <App />
      </QueryClientProvider>
    </StrictMode>
  </Auth0Provider>,
)
