import { Modal, Typography, Flex, Button, Dropdown } from '@/shared/antd-imports';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { BankOutlined } from '@/shared/antd-imports';
import { colors } from '../../../styles/colors';
import { useTranslation } from 'react-i18next';

import OverviewTeamInfoModalTabs from './overview-team-info-modal-tabs';
import { toggleOverViewTeamDrawer } from '@/features/reporting/reporting.slice';
import { IRPTTeam } from '@/types/reporting/reporting.types';

type OverviewTeamInfoModalProps = {
  team: IRPTTeam | null;
};

const OverviewTeamInfoModal = ({ team }: OverviewTeamInfoModalProps) => {
  const { t } = useTranslation('reporting-overview-drawer');

  const dispatch = useAppDispatch();

  const isModalOpen = useAppSelector(state => state.reportingReducer.showOverViewTeamDrawer);

  const handleClose = () => {
    dispatch(toggleOverViewTeamDrawer());
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleClose}
      width={1000}
      centered
      destroyOnClose
      footer={null}
      title={
        team && (
          <Flex gap={8} align="center" style={{ fontWeight: 500 }}>
            <BankOutlined style={{ color: colors.lightGray, fontSize: 20 }} />
            <Typography.Text style={{ fontSize: 16 }}>{team.name}</Typography.Text>
          </Flex>
        )
      }
    >
      <OverviewTeamInfoModalTabs teamsId={team?.id} />
    </Modal>
  );
};

export default OverviewTeamInfoModal;
