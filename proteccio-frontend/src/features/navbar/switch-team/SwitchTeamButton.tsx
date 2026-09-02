// Ant Design Icons
import { CaretDownFilled, CheckCircleFilled } from '@/shared/antd-imports';

// Ant Design Components
import { Card, Divider, Dropdown, Flex, Tooltip, Typography } from '@/shared/antd-imports';

// Redux Hooks
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';

// Redux Actions
import { fetchTeams, setActiveTeam } from '@/features/teams/teamSlice';
import { verifyAuthentication } from '@/features/auth/authSlice';
import { setUser } from '@/features/user/userSlice';

// Hooks & Services
import { useAuthService } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createAuthService } from '@/services/auth/auth.service';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';
import { evt_common_switch_team } from '@/shared/proteccio-analytics-events';

// Components
import CustomAvatar from '@/components/CustomAvatar';

// Styles
import { colors } from '@/styles/colors';
import './switchTeam.css';
import { useEffect, memo } from 'react';

const SwitchTeamButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authService = createAuthService(navigate);
  const { getCurrentSession } = useAuthService();
  const session = getCurrentSession();
  const { t } = useTranslation('navbar');
  const { setIdentity, trackMixpanelEvent } = useMixpanelTracking();

  // Selectors
  const teamsList = useAppSelector(state => state.teamReducer.teamsList);
  const themeMode = useAppSelector(state => state.themeReducer.mode);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  const isActiveTeam = (teamId: string): boolean => {
    if (!teamId || !session?.team_id) return false;
    return teamId === session.team_id;
  };

  const handleVerifyAuth = async () => {
    const result = await dispatch(verifyAuthentication()).unwrap();
    if (result.authenticated) {
      dispatch(setUser(result.user));
      authService.setCurrentSession(result.user);
      setIdentity(result.user);
    }
  };

  const handleTeamSelect = async (id: string) => {
    if (!id) return;

    trackMixpanelEvent(evt_common_switch_team);
    await dispatch(setActiveTeam(id));
    await handleVerifyAuth();
    // Redirect to home page after switching teams
    navigate('/proteccio/home');
    // Force a full reload to ensure the new team session is properly loaded
    window.location.href = '/proteccio/home';
  };

  const renderTeamCard = (team: any, index: number) => (
    <Card
      className="switch-team-card"
      onClick={() => handleTeamSelect(team.id)}
      bordered={false}
      style={{ width: 230 }}
    >
      <Flex vertical>
        <Flex gap={12} align="center" justify="space-between" style={{ padding: '4px 12px' }}>
          <Flex gap={8} align="center">
            <CustomAvatar avatarName={team.name || ''} />
            <Flex vertical>
              <Typography.Text style={{ fontSize: 11, fontWeight: 300 }}>
                Owned by {team.owns_by}
              </Typography.Text>
              <Typography.Text>{team.name}</Typography.Text>
            </Flex>
          </Flex>
          <CheckCircleFilled
            style={{
              fontSize: 16,
              color: isActiveTeam(team.id) ? colors.limeGreen : colors.lightGray,
            }}
          />
        </Flex>
        {index < teamsList.length - 1 && <Divider style={{ margin: 0 }} />}
      </Flex>
    </Card>
  );

  const dropdownItems =
    teamsList?.map((team, index) => ({
      key: team.id || '',
      label: renderTeamCard(team, index),
      type: 'item' as const,
    })) || [];

  return (
    <Dropdown
      overlayClassName="switch-team-dropdown"
      menu={{ items: dropdownItems }}
      trigger={['click']}
      placement="bottomRight"
    >
      <Tooltip title={t('switchTeamTooltip')} trigger={'hover'}>
        <Flex
          gap={12}
          align="center"
          justify="center"
          style={{
            color: 'var(--pc-text)',
            backgroundColor: 'var(--pc-panel-2)',
            fontWeight: 600,
            borderRadius: 12,
            padding: '0 14px',
            height: 44,
            cursor: 'pointer',
            border: '1px solid var(--pc-line)',
          }}
        >
          <span className="proteccio-team-mark" aria-hidden="true">
            {session?.team_name?.charAt(0).toUpperCase() || 'P'}
          </span>
          <Typography.Text strong style={{ color: 'var(--pc-text)', cursor: 'pointer' }}>
            {session?.team_name}
          </Typography.Text>
          <CaretDownFilled />
        </Flex>
      </Tooltip>
    </Dropdown>
  );
};

export default memo(SwitchTeamButton);
