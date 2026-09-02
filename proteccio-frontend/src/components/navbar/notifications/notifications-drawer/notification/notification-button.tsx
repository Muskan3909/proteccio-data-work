import { Badge, Button, Tooltip } from '@/shared/antd-imports';
import { toggleDrawer } from '@features/navbar/notificationSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';

const NotificationButton = () => {
  const dispatch = useAppDispatch();
  const { unreadNotificationsCount } = useAppSelector(state => state.notificationReducer);
  const { t } = useTranslation('navbar');

  const hasUnreadNotifications = () => {
    return unreadNotificationsCount > 0;
  };

  const bell = <span className="proteccio-navbar-bell" aria-hidden="true">🔔</span>;

  return (
    <Tooltip title={t('notificationTooltip')} trigger={'hover'}>
      <Button
        style={{ height: '62px', width: '60px' }}
        type="text"
        icon={
          hasUnreadNotifications() ? (
            <Badge count={unreadNotificationsCount}>
              {bell}
            </Badge>
          ) : (
            bell
          )
        }
        className="proteccio-navbar-icon-button"
        onClick={() => dispatch(toggleDrawer())}
      />
    </Tooltip>
  );
};

export default NotificationButton;
