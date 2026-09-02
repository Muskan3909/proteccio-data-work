import { Navigate, RouteObject, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { SuspenseFallback } from '@/components/suspense-fallback/suspense-fallback';
import ChunkErrorHandler from '@/utils/chunk-error-handler';

const OrganizationInvitePage = lazy(
  ChunkErrorHandler.wrapLazyImport(
    () => import('@/pages/client-view/organization-invite/organization-invite'),
    'OrganizationInvitePage'
  )
);

const TeamInvitePage = lazy(
  ChunkErrorHandler.wrapLazyImport(
    () => import('@/pages/invite/team/TeamInvitePage'),
    'TeamInvitePage'
  )
);

const ProjectInvitePage = lazy(
  ChunkErrorHandler.wrapLazyImport(
    () => import('@/pages/invite/project/ProjectInvitePage'),
    'ProjectInvitePage'
  )
);

const LegacyRouteRedirect = () => {
  const location = useLocation();
  const proteccioPath = location.pathname.replace(/^\/(?:Proteccio|worklenz)(?=\/|$)/i, '/proteccio');

  return <Navigate to={`${proteccioPath}${location.search}${location.hash}`} replace />;
};

const rootRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/Proteccio/*',
    element: <LegacyRouteRedirect />,
  },
  {
    path: '/worklenz/*',
    element: <LegacyRouteRedirect />,
  },
  {
    path: '/organization-invite',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <OrganizationInvitePage />
      </Suspense>
    ),
  },
  {
    path: '/invite/team/:token',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <TeamInvitePage />
      </Suspense>
    ),
  },
  {
    path: '/invite/project/:token',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <ProjectInvitePage />
      </Suspense>
    ),
  },
];

export default rootRoutes;
