import React, { useMemo, useCallback, useEffect, useState } from 'react';
import {
  Card,
  Segmented,
  Skeleton,
  Empty,
  Typography,
  Alert,
  Button,
  Tooltip,
} from '@/shared/antd-imports';
import { ClockCircleOutlined, UnorderedListOutlined, SyncOutlined } from '@/shared/antd-imports';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { ActivityFeedType } from '@/types/home/user-activity.types';
import { setActiveTab } from '@/features/home-page/user-activity.slice';
import {
  useGetUserRecentTasksQuery,
  useGetUserTimeLoggedTasksQuery,
} from '@/api/home-page/user-activity.api.service';
import TaskActivityList from './task-activity-list';
import TimeLoggedTaskList from './time-logged-task-list';

const { Title } = Typography;

const getActivityItems = (response: unknown): any[] => {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== 'object') return [];

  const payload = response as Record<string, unknown>;
  if (Array.isArray(payload.body)) return payload.body;
  if (Array.isArray(payload.data)) return payload.data;

  return Object.values(payload).find(Array.isArray) || [];
};

const UserActivityFeed: React.FC = () => {
  const { t } = useTranslation('home');
  const dispatch = useAppDispatch();
  const { activeTab } = useAppSelector(state => state.userActivityReducer);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: recentTasksData,
    isLoading: loadingRecentTasks,
    isFetching: isFetchingRecentTasks,
    error: recentTasksError,
    refetch: refetchRecentTasks,
  } = useGetUserRecentTasksQuery(
    { limit: 10 },
    {
      skip: false,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: timeLoggedTasksData,
    isLoading: loadingTimeLoggedTasks,
    isFetching: isFetchingTimeLoggedTasks,
    error: timeLoggedTasksError,
    refetch: refetchTimeLoggedTasks,
  } = useGetUserTimeLoggedTasksQuery(
    { limit: 10 },
    {
      skip: false,
      refetchOnMountOrArgChange: true,
    }
  );

  const recentTasks = useMemo(() => {
    return getActivityItems(recentTasksData);
  }, [recentTasksData]);

  const timeLoggedTasks = useMemo(() => {
    return getActivityItems(timeLoggedTasksData);
  }, [timeLoggedTasksData]);

  const segmentOptions = useMemo(
    () => [
      {
        value: ActivityFeedType.TIME_LOGGED_TASKS,
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {t('tasks.timeLoggedSegment')}
          </span>
        ),
      },
      {
        value: ActivityFeedType.RECENT_TASKS,
        label: (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {t('tasks.recentTasksSegment')}
          </span>
        ),
      },
    ],
    [t]
  );

  const handleTabChange = useCallback(
    (value: ActivityFeedType) => {
      dispatch(setActiveTab(value));
    },
    [dispatch]
  );

  // Refetch data when the active tab changes
  useEffect(() => {
    if (activeTab === ActivityFeedType.RECENT_TASKS) {
      refetchRecentTasks();
    } else if (activeTab === ActivityFeedType.TIME_LOGGED_TASKS) {
      refetchTimeLoggedTasks();
    }
  }, [activeTab, refetchRecentTasks, refetchTimeLoggedTasks]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (activeTab === ActivityFeedType.TIME_LOGGED_TASKS) {
        await refetchTimeLoggedTasks();
      } else {
        await refetchRecentTasks();
      }
    } finally {
      // Keep the spinning animation for at least 500ms for better UX
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [activeTab, refetchRecentTasks, refetchTimeLoggedTasks]);

  const isLoading = useMemo(() => {
    if (activeTab === ActivityFeedType.TIME_LOGGED_TASKS) {
      return loadingTimeLoggedTasks || isFetchingTimeLoggedTasks || isRefreshing;
    }
    return loadingRecentTasks || isFetchingRecentTasks || isRefreshing;
  }, [
    activeTab,
    loadingTimeLoggedTasks,
    isFetchingTimeLoggedTasks,
    loadingRecentTasks,
    isFetchingRecentTasks,
    isRefreshing,
  ]);

  const currentCount =
    activeTab === ActivityFeedType.TIME_LOGGED_TASKS ? timeLoggedTasks.length : recentTasks.length;

  const renderContent = () => {
    if (activeTab === ActivityFeedType.TIME_LOGGED_TASKS) {
      if (loadingTimeLoggedTasks) {
        return <Skeleton active />;
      }
      if (timeLoggedTasksError) {
        return <Alert message={t('tasks.errorLoadingTimeLoggedTasks')} type="error" showIcon />;
      }
      if (timeLoggedTasks.length === 0) {
        return <Empty description={t('tasks.noTimeLoggedTasks')} />;
      }
      return (
        <div style={{ maxHeight: 450, overflow: 'auto' }}>
          <TimeLoggedTaskList tasks={timeLoggedTasks} />
        </div>
      );
    } else if (activeTab === ActivityFeedType.RECENT_TASKS) {
      if (loadingRecentTasks) {
        return <Skeleton active />;
      }
      if (recentTasksError) {
        return <Alert message={t('tasks.errorLoadingRecentTasks')} type="error" showIcon />;
      }
      if (recentTasks.length === 0) {
        return <Empty description={t('tasks.noRecentTasks')} />;
      }
      return (
        <div style={{ maxHeight: 450, overflow: 'auto' }}>
          <TaskActivityList tasks={recentTasks} />
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title={
        <Typography.Title level={5} style={{ marginBlockEnd: 0 }}>
          {t('tasks.recentActivity')} ({currentCount})
        </Typography.Title>
      }
      extra={
        <Tooltip title={t('tasks.refresh')}>
          <Button
            shape="circle"
            icon={<SyncOutlined spin={isLoading} />}
            onClick={handleRefresh}
            disabled={isLoading}
          />
        </Tooltip>
      }
      style={{ width: '100%' }}
    >
      <Segmented
        options={segmentOptions}
        value={activeTab}
        onChange={handleTabChange}
        style={{ marginBottom: 16 }}
      />
      {renderContent()}
    </Card>
  );
};

export default React.memo(UserActivityFeed);
