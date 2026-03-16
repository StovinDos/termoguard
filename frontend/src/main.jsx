import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0d1420',
              color: '#e8f0fe',
              border: '1px solid rgba(0,245,212,0.2)',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              letterSpacing: '0.05em',
            },
            success: {
              iconTheme: { primary: '#00f5d4', secondary: '#0d1420' },
            },
            error: {
              iconTheme: { primary: '#ff3860', secondary: '#0d1420' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
