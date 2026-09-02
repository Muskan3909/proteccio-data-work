import { Tabs } from '@/shared/antd-imports';
import { TabsProps } from 'antd/lib';
import { useTranslation } from 'react-i18next';
import OverviewReportsOverviewTab from '../drawers/overview-team-info/overview-tab/reports-overview-tab';
import OverviewReportsProjectsTab from '../drawers/overview-team-info/projects-tab/reporting-overview-projects-tab';
import OverviewReportsMembersTab from '../drawers/overview-team-info/members-tab/reporting-overview-members-tab';

type OverviewTeamInfoModalTabsProps = {
  teamsId?: string | null;
};

const OverviewTeamInfoModalTabs = ({ teamsId = null }: OverviewTeamInfoModalTabsProps) => {
  const { t } = useTranslation('reporting-overview-drawer');

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: t('overviewTab'),
      children: <OverviewReportsOverviewTab teamId={teamsId} />,
    },
    {
      key: 'projects',
      label: t('projectsTab'),
      children: <OverviewReportsProjectsTab teamsId={teamsId} />,
    },
    {
      key: 'members',
      label: t('membersTab'),
      children: <OverviewReportsMembersTab teamsId={teamsId} />,
    },
  ];

  return (
    <Tabs
      type="card"
      items={tabItems}
      destroyOnClose
      defaultActiveKey="overview"
      tabBarStyle={{
        margin: 0,
        borderBottom: '1px solid rgba(148, 163, 184, 0.16)',
        background: 'rgba(15, 24, 36, 0.45)',
      }}
      size="small"
      className="reporting-modal-tabs"
    />
  );
};

export default OverviewTeamInfoModalTabs;
