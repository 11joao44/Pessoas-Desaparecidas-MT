// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '../components/Layout'; // Importe o novo Layout

const HomePage = lazy(() => import('../pages/HomePage'));
const DetailsPage = lazy(() => import('../pages/DetailsPage'));

import SuspenseFallback from '../components/SuspenseFallback';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
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
