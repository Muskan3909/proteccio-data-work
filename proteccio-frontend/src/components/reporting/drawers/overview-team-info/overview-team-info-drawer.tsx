import { Drawer, Modal, Typography, Flex, Button, Dropdown, Space, Segmented } from '@/shared/antd-imports';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { BankOutlined } from '@/shared/antd-imports';
import { colors } from '../../../../styles/colors';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import OverviewTeamInfoDrawerTabs from './overview-team-info-drawer-tabs';
import OverviewTeamInfoModalTabs from '../../modals/overview-team-info-modal-tabs';
import { toggleOverViewTeamDrawer } from '@/features/reporting/reporting.slice';
import { IRPTTeam } from '@/types/reporting/reporting.types';

type OverviewTeamInfoDrawerProps = {
  team: IRPTTeam | null;
  useModal?: boolean; // Add option to use modal instead of drawer
};

const OverviewTeamInfoDrawer = ({ team, useModal = false }: OverviewTeamInfoDrawerProps) => {
  const { t } = useTranslation('reporting-overview-drawer');

  const dispatch = useAppDispatch();

  const isDrawerOpen = useAppSelector(state => state.reportingReducer.showOverViewTeamDrawer);

  const handleClose = () => {
    dispatch(toggleOverViewTeamDrawer());
  };

  // If useModal is true, render as Modal instead of Drawer
  if (useModal) {
    return (
      <Modal
        open={isDrawerOpen}
        onCancel={handleClose}
        width={1000}
        centered
        destroyOnClose
        footer={null}
        closeIcon={<span style={{ fontSize: 18, color: '#dfe7f1', lineHeight: 1 }}>×</span>}
        styles={{
          content: {
            background: '#081b2b',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: 14,
            boxShadow: '0 18px 48px rgba(2, 6, 23, 0.55)',
            overflow: 'hidden',
          },
          header: {
            background: '#081b2b',
            borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
            padding: '14px 18px 12px',
          },
          body: {
            background: '#081b2b',
            padding: '10px 18px 16px',
          },
          mask: {
            backgroundColor: 'rgba(2, 6, 23, 0.68)',
          },
        }}
        title={
          team && (
            <Flex gap={8} align="center" style={{ fontWeight: 600, color: '#e5edf8' }}>
              <BankOutlined style={{ color: '#9db0c9', fontSize: 18 }} />
              <Typography.Text style={{ fontSize: 18, color: '#e5edf8' }}>{team.name}</Typography.Text>
            </Flex>
          )
        }
      >
        <OverviewTeamInfoModalTabs teamsId={team?.id} />
      </Modal>
    );
  }

  return (
    <Drawer
      open={isDrawerOpen}
      destroyOnHidden
      onClose={handleClose}
      width={900}
      title={
        team && (
          <Flex align="center" justify="space-between">
            <Flex gap={4} align="center" style={{ fontWeight: 500 }}>
              <BankOutlined style={{ color: colors.lightGray }} />
              <Typography.Text style={{ fontSize: 16 }}>{team.name}</Typography.Text>
            </Flex>

            {/* <Dropdown
              menu={{
                items: [
                  { key: '1', label: t('projectsButton') },
                  { key: '2', label: t('membersButton') },
                ],
              }}
            >
              <Button type="primary" icon={<DownOutlined />} iconPosition="end">
                {t('exportButton')}
              </Button>
            </Dropdown> */}
          </Flex>
        )
      }
    >
      <OverviewTeamInfoDrawerTabs teamsId={team?.id} />
    </Drawer>
  );
};

export default OverviewTeamInfoDrawer;
