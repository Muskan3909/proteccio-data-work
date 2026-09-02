import { Card, Flex, Typography, QRCode } from '@/shared/antd-imports';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/useAppSelector';
import { RootState } from '@/app/store';
import { useDocumentTitle } from '@/hooks/useDoumentTItle';
import {
  PROTECCIO_MOBILE_APP_URL,
  PROTECCIO_APP_STORE_URL,
  PROTECCIO_GOOGLE_PLAY_URL,
} from '@/shared/mobile-app-constants';

const MobileAppSettings = () => {
  const { t } = useTranslation('settings/mobile-app');
  const themeMode = useAppSelector((state: RootState) => state.themeReducer.mode);
  const isDark = themeMode === 'dark';

  useDocumentTitle(t('pageTitle'));

  return (
    <Card style={{ width: '100%' }}>
      <Flex vertical gap={24}>
        <Flex vertical gap={4}>
          <Typography.Title level={4} style={{ marginBlockEnd: 0 }}>
            {t('pageTitle')}
          </Typography.Title>
          <Typography.Text type="secondary">{t('pageDescription')}</Typography.Text>
        </Flex>

        <Flex vertical align="flex-start" gap={16}>
          {!PROTECCIO_MOBILE_APP_URL && (
            <Typography.Text type="secondary">
              Our mobile apps are coming soon. Check back here for the download link.
            </Typography.Text>
          )}
          {PROTECCIO_MOBILE_APP_URL && (
            <>
              <QRCode
                value={PROTECCIO_MOBILE_APP_URL}
                size={180}
                color={isDark ? '#ffffff' : '#000000'}
                bgColor={isDark ? '#131B27' : '#ffffff'}
              />

              <Flex gap={12} wrap>
                <a href={PROTECCIO_APP_STORE_URL} target="_blank" rel="noopener noreferrer">
                  <img
                    src="/img/app-store-badge.svg"
                    alt={t('appStoreBadgeAlt')}
                    style={{ height: 40 }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </a>
                <a href={PROTECCIO_GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer">
                  <img
                    src="/img/google-play-badge.png"
                    alt={t('googlePlayBadgeAlt')}
                    style={{ height: 40 }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </a>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

export default MobileAppSettings;
