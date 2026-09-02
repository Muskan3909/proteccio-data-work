import { Layout } from '@/shared/antd-imports';
import { Outlet, useLocation } from 'react-router-dom';
import { memo, useMemo } from 'react';

import Navbar from '@/features/navbar/navbar';
import { useAppSelector } from '../hooks/useAppSelector';
import { TrialExpirationAlert } from '@/components/TrialExpirationAlert/TrialExpirationAlert';
import UpgradePlansModal from '@/Proteccio-ee/components/UpgradePlansModal';
import { ImportProgressNotifier } from '@/components/imports/ImportProgressNotifier';

const MainLayout = memo(() => {
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const location = useLocation();

  const isProjectView = useMemo(
    () =>
      (location.pathname.includes('/projects/') && !location.pathname.endsWith('/projects')) ||
      location.pathname.includes('/proteccio/schedule'),
    [location.pathname]
  );

  const isProjectListView = useMemo(
    () => location.pathname.includes('/projects') && location.search.includes('page='),
    [location.pathname, location.search]
  );

  const isHomeView = location.pathname.endsWith('/home');

  const contentClassName = [
    'px-4 sm:px-8 lg:px-12 xl:px-16 mx-auto w-full',
    !isProjectView && !isHomeView && !isProjectListView ? 'overflow-x-hidden max-w-[1400px]' : '',
    isHomeView ? 'overflow-x-hidden max-w-none' : '',
    isProjectListView ? 'overflow-x-hidden max-w-[1600px]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <ImportProgressNotifier />
      <Layout className="min-h-screen">
        <TrialExpirationAlert />

        <Layout.Header
          className={`sticky top-0 z-[999] flex items-center p-0 shadow-md ${
            themeMode === 'dark' ? 'border-b border-[#26313F]' : 'shadow-[#18181811]'
          }`}
          style={{ height: 68, lineHeight: 'normal' }}
        >
          <Navbar />
        </Layout.Header>

        <Layout.Content className={contentClassName}>
          <Outlet />
        </Layout.Content>
      </Layout>

      <UpgradePlansModal />
    </>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
