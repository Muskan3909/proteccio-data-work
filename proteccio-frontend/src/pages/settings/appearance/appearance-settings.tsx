import { Card, Flex, Switch, theme, Typography } from '@/shared/antd-imports';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { toggleTheme } from '@/features/theme/themeSlice';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import { MoonOutlined, SunOutlined } from '@/shared/antd-imports';
import { evt_dark_mode_toggled } from '@/shared/proteccio-analytics-events';
import { ThemeMode } from '@/types/mixpanel-events.types';
import { useMixpanelTracking } from '@/hooks/useMixpanelTracking';

const AppearanceSettings = () => {
  const { t } = useTranslation('settings/appearance');
  const themeMode = useAppSelector(state => state.themeReducer.mode);
  const dispatch = useAppDispatch();
  const { trackMixpanelEvent } = useMixpanelTracking();
  const { token } = theme.useToken();

  useDocumentTitle(t('title'));

  const handleThemeToggle = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';

    // Track the theme toggle event
    trackMixpanelEvent(evt_dark_mode_toggled, {
      mode: newMode,
    });

    dispatch(toggleTheme());
  };

  return (
    <Card style={{ width: '100%' }}>
      <Flex vertical gap={4}>
        <Flex gap={8} align="center">
          <Switch
            checked={themeMode === 'dark'}
            onChange={handleThemeToggle}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
            {t('darkMode')}
          </Typography.Title>
        </Flex>
        <Typography.Text style={{ fontSize: 14, color: token.colorTextSecondary }}>
          {t('darkModeDescription')}
        </Typography.Text>
      </Flex>
    </Card>
  );
};

export default AppearanceSettings;
