// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout'; // Importe o novo Layout

// Importe as páginas
const HomePage = lazy(() => import('../pages/HomePage'));
const DetailsPage = lazy(() => import('../pages/DetailsPage'));

import SuspenseFallback from '../components/SuspenseFallback';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // O Layout é o elemento principal
    children: [
      // As rotas aninhadas serão renderizadas dentro do <Outlet /> do Layout
      {
        index: true, // Isso torna HomePage a rota padrão para '/'
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'details/:id',
        element: (
          <Suspense fallback={<SuspenseFallback />}>
            <DetailsPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
