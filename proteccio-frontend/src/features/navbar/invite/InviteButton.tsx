import { UsergroupAddOutlined } from '@/shared/antd-imports';
import { Button, Tooltip } from '@/shared/antd-imports';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../styles/colors';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleInviteMemberDrawer } from '../../settings/member/memberSlice';
import { useAuthService } from '@/hooks/useAuth';
import { getRoleDefinition, getSessionRoleName } from '@/utils/role-permissions.utils';

const InviteButton = () => {
  const dispatch = useAppDispatch();
  const authService = useAuthService();
  const currentSession = authService.getCurrentSession();
  const isInviteRestricted = Boolean(currentSession?.is_expired);
  const currentRole = getSessionRoleName(currentSession);
  const canInviteMembers = getRoleDefinition(currentRole).canInviteMembers;

  // localization
  const { t } = useTranslation('navbar');
  const { t: tCommon } = useTranslation('common');

  const inviteTooltip = isInviteRestricted
    ? tCommon('license-expired-subtitle', {
        defaultValue:
          'Your Proteccio subscription has ended. Please renew to continue enjoying all features.',
      })
    : t('inviteTooltip', {
        defaultValue: 'Invite team members',
      });

  if (!canInviteMembers) {
    return null;
  }

  return (
    <Tooltip title={inviteTooltip}>
      <Button
        type="dashed"
        icon={<UsergroupAddOutlined />}
        style={{
          height: 44,
          color: '#2ed573',
          borderColor: '#2ed573',
          borderRadius: 12,
          padding: '0 18px',
          background: 'transparent',
          fontWeight: 700,
        }}
        disabled={isInviteRestricted}
        onClick={() => {
          if (isInviteRestricted) return;
          dispatch(toggleInviteMemberDrawer());
        }}
      >
        {t('invite', { defaultValue: 'Invite' })}
      </Button>
    </Tooltip>
  );
};

export default memo(InviteButton);
