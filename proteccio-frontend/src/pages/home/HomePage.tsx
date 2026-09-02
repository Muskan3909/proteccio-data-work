import React, { useEffect, memo, useMemo, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import Col from 'antd/es/col';
import Flex from 'antd/es/flex';
import Row from 'antd/es/row';
import GreetingWithTime from './GreetingWithTime';
import TasksList from '@/pages/home/task-list/TasksList';
import { ProjectDrawer } from '@/components/projects/project-drawer/project-drawer';
import CreateProjectButton from '@/components/projects/project-create-button/project-create-button';
import RecentAndFavouriteProjectList from '@/pages/home/recent-and-favourite-project-list/recent-and-favourite-project-list';
import TodoList from './todo-list/todo-list';

import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAuthService } from '@/hooks/useAuth';

import { fetchProjectStatuses } from '@/features/projects/lookups/projectStatuses/projectStatusesSlice';
import { fetchProjectCategories } from '@/features/projects/lookups/projectCategories/projectCategoriesSlice';
import { fetchProjectHealth } from '@/features/projects/lookups/projectHealth/projectHealthSlice';
import { fetchProjects } from '@/features/home-page/home-page.slice';
import {
  useGetMyTasksQuery,
  useGetProjectsByTeamQuery,
} from '@/api/home-page/home-page.api.service';
import { createPortal } from 'react-dom';
import UserActivityFeed from './user-activity-feed/user-activity-feed';
import './ProteccioHomeDashboard.css';

const DESKTOP_MIN_WIDTH = 1024;
const TASK_LIST_MIN_WIDTH = 500;
const SIDEBAR_MAX_WIDTH = 400;

// Lazy load heavy components
const TaskDrawer = React.lazy(() => import('@/components/task-drawer/task-drawer'));
const SurveyPromptModal = React.lazy(() =>
  import('@/components/survey/SurveyPromptModal').then(m => ({ default: m.SurveyPromptModal }))
);

const HomePage = memo(() => {
  const dispatch = useAppDispatch();
  const { model, projects, homeTasksConfig } = useAppSelector(state => state.homePageReducer);
  const { data: liveTasksData } = useGetMyTasksQuery(homeTasksConfig);
  const { data: liveProjectsData } = useGetProjectsByTeamQuery();
  const isDesktop = useMediaQuery({ query: `(min-width: ${DESKTOP_MIN_WIDTH}px)` });
  const isOwnerOrAdmin = useAuthService().isOwnerOrAdmin();

  useDocumentTitle('Home');

  // Preload TaskDrawer component to prevent dynamic import failures
  useEffect(() => {
    const preloadTaskDrawer = async () => {
      try {
        await import('@/components/task-drawer/task-drawer');
      } catch (error) {
        console.warn('Failed to preload TaskDrawer:', error);
      }
    };

    preloadTaskDrawer();
  }, []);

  // Memoize fetch function to prevent recreation on every render
  const fetchLookups = useCallback(async () => {
    const fetchPromises = [
      dispatch(fetchProjectHealth()),
      dispatch(fetchProjectCategories()),
      dispatch(fetchProjectStatuses()),
      dispatch(fetchProjects()),
    ].filter(Boolean);

    await Promise.all(fetchPromises);
  }, [dispatch]);

  useEffect(() => {
    fetchLookups();
  }, [fetchLookups]);

  const liveModel = liveTasksData?.body || model;
  const liveProjects = liveProjectsData?.body || projects;
  const totalTasks = liveModel.total || 0;
  const criticalAlerts = liveModel.overdue || 0;
  const tasksOnTrack = Math.max(totalTasks - criticalAlerts, 0);
  const protectionScore = totalTasks > 0 ? Math.round((tasksOnTrack / totalTasks) * 100) : 0;

  // Memoize project drawer close handler
  const handleProjectDrawerClose = useCallback(() => {}, []);

  // Memoize desktop flex styles to prevent object recreation
  const desktopFlexStyle = useMemo(
    () => ({
      minWidth: TASK_LIST_MIN_WIDTH,
      width: '100%',
    }),
    []
  );

  const sidebarFlexStyle = useMemo(
    () => ({
      width: '100%',
      maxWidth: SIDEBAR_MAX_WIDTH,
    }),
    []
  );

  // Memoize components to prevent unnecessary re-renders
  const CreateProjectButtonComponent = useMemo(() => {
    if (!isOwnerOrAdmin) return null;

    return isDesktop ? (
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <CreateProjectButton />
      </div>
    ) : (
      <CreateProjectButton />
    );
  }, [isDesktop, isOwnerOrAdmin]);

  return (
    <div className="proteccio-home">
      <div className="proteccio-home__hero">
        <div className="proteccio-home__greeting">
          <GreetingWithTime />
        </div>
        <div className="proteccio-home__actions">{CreateProjectButtonComponent}</div>
      </div>

      <div className="proteccio-home__statbar" aria-label="Home summary">
        <div className="proteccio-home__stat">
          <div className="proteccio-home__stat-ring">
            <span>{protectionScore}%</span>
          </div>
          <div>
            <span className="proteccio-home__stat-value">{protectionScore}</span>
            <span className="proteccio-home__stat-label">Protection score</span>
          </div>
        </div>
        <div className="proteccio-home__stat">
          <div>
            <span className="proteccio-home__stat-value green">{tasksOnTrack}</span>
            <span className="proteccio-home__stat-label">Tasks on track</span>
          </div>
        </div>
        <div className="proteccio-home__stat">
          <div>
            <span className="proteccio-home__stat-value amber">{liveModel.upcoming || 0}</span>
            <span className="proteccio-home__stat-label">Access reviews due</span>
          </div>
        </div>
        <div className="proteccio-home__stat">
          <div>
            <span className="proteccio-home__stat-value red">{criticalAlerts}</span>
            <span className="proteccio-home__stat-label">Critical alerts</span>
          </div>
        </div>
        <div className="proteccio-home__stat">
          <div>
            <span className="proteccio-home__stat-value">{liveProjects.length}</span>
            <span className="proteccio-home__stat-label">Active projects</span>
          </div>
        </div>
      </div>

      <div className="proteccio-home__grid">
        <div className="proteccio-panel">
          <TasksList />
        </div>
        <div className="proteccio-panel">
          <RecentAndFavouriteProjectList />
        </div>
        <div className="proteccio-feed-stack">
          <div className="proteccio-panel">
            <TodoList />
          </div>
          <div className="proteccio-panel proteccio-feed">
            <UserActivityFeed />
          </div>
        </div>
      </div>

      {createPortal(<TaskDrawer />, document.body, 'home-task-drawer')}
      {createPortal(<ProjectDrawer onClose={() => {}} />, document.body, 'project-drawer')}
      {createPortal(<SurveyPromptModal />, document.body, 'survey-modal')}
    </div>
  );
});

HomePage.displayName = 'HomePage';

export default HomePage;