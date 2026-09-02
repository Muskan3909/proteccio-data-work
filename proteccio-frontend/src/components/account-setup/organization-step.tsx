import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, InputRef, Typography, Card, Tooltip } from '@/shared/antd-imports';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setOrganizationName } from '@/features/account-setup/account-setup.slice';
import { RootState } from '@/app/store';
import { sanitizeInput } from '@/utils/sanitizeInput';

const { Title, Paragraph, Text } = Typography;

interface Props {
  onEnter: () => void;
  styles: any;
  organizationNamePlaceholder: string;
  organizationNameInitialValue?: string;
  isDarkMode: boolean;
  token?: any;
}

export const OrganizationStep: React.FC<Props> = ({
  onEnter,
  styles,
  organizationNamePlaceholder,
  organizationNameInitialValue,
  isDarkMode,
  token,
}) => {
  const { t } = useTranslation('account-setup');
  const dispatch = useDispatch();
  const { organizationName } = useSelector((state: RootState) => state.accountSetupReducer);
  const inputRef = useRef<InputRef>(null);

  // Autofill organization name if not already set
  useEffect(() => {
    if (!organizationName && organizationNameInitialValue) {
      dispatch(setOrganizationName(organizationNameInitialValue));
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const onPressEnter = () => {
    if (!organizationName.trim()) return;
    onEnter();
  };

  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    dispatch(setOrganizationName(sanitizedValue));
  };

  return (
    <div className="w-full organization-step">
      {/* Header */}
      <div className="text-center mb-8">
        <Title level={3} className="mb-2" style={{ color: token?.colorText }}>
          {t('organizationStepWelcome')}
        </Title>
        <Paragraph className="text-base" style={{ color: token?.colorTextSecondary }}>
          {t('organizationStepDescription')}
        </Paragraph>
      </div>

      {/* Main Form Card */}
      <div className="mb-6">
        <Card
          className="organization-step-card"
          style={{
            borderColor: 'rgba(148, 163, 184, 0.28)',
            backgroundColor: '#111b2a',
          }}
        >
          <Form.Item
            className="mb-4"
            label={
              <div className="flex items-center space-x-2">
                <span className="font-medium text-base" style={{ color: token?.colorText }}>
                  {t('organizationStepLabel')}
                </span>
                <Tooltip title={t('organizationStepTooltip')}>
                  <span className="text-sm cursor-help" style={{ color: token?.colorTextTertiary }}>
                    ⓘ
                  </span>
                </Tooltip>
              </div>
            }
          >
            <Input
              placeholder={organizationNamePlaceholder || t('organizationStepPlaceholder')}
              value={organizationName}
              onChange={handleOrgNameChange}
              onPressEnter={onPressEnter}
              ref={inputRef}
              className="organization-name-input"
              maxLength={50}
            />
          </Form.Item>

          {/* Character Count and Validation */}
          <div className="flex justify-between items-center text-sm">
            <Text type="secondary">
              {organizationName.length}/50 {t('organizationStepCharacters')}
            </Text>
            {organizationName.length > 0 && (
              <div className="flex items-center space-x-1">
                {organizationName.length >= 2 ? (
                  <span style={{ color: token?.colorSuccess }}>
                    ✓ {t('organizationStepGoodLength')}
                  </span>
                ) : (
                  <span style={{ color: token?.colorWarning }}>
                    ⚠ {t('organizationStepTooShort')}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Footer Note */}
      <div
        className="organization-privacy-note text-center p-4 rounded-lg"
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.62)',
          borderColor: 'rgba(148, 163, 184, 0.3)',
          border: '1px solid',
        }}
      >
        <Text type="secondary" className="text-sm">
          🔒 {t('organizationStepPrivacyNote')}
        </Text>
      </div>
    </div>
  );
};
