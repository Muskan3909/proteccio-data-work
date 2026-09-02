import { theme } from '@/shared/antd-imports';
import type { ThemeConfig } from 'antd';

// Proteccio design tokens — keep in sync with src/styles/proteccio-theme.css
export const proteccio = {
  dark: {
    bg: '#08111F',
    panel: '#131B27',
    panel2: '#1A2432',
    line: '#26313F',
    text: '#F3F6F9',
    textDim: '#93A1AF',
  },
  light: {
    bg: '#F4F7F6',
    panel: '#FFFFFF',
    panel2: '#F1F5F3',
    line: '#E3E9E6',
    text: '#0B1221',
    textDim: '#5B6B78',
  },
  cyan: '#2ED573',
  cyanDim: 'rgba(46,213,115,0.14)',
  amber: '#F0A93F',
  amberDim: 'rgba(240,169,63,0.14)',
  red: '#F1555C',
  redDim: 'rgba(241,85,92,0.14)',
  violet: '#17A863',
  admin: '#4C7EFF',
  adminDim: 'rgba(76,126,255,0.14)',
};

export const getThemeConfig = (currentTheme: 'light' | 'dark'): ThemeConfig => {
  const isDark = currentTheme === 'dark';
  const p = isDark ? proteccio.dark : proteccio.light;

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: proteccio.cyan,
      colorSuccess: proteccio.cyan,
      colorWarning: proteccio.amber,
      colorError: proteccio.red,
      colorInfo: proteccio.admin,
      colorLink: proteccio.cyan,
      colorLinkHover: proteccio.cyan,
      borderRadius: 10,
      borderRadiusLG: 12,
      borderRadiusSM: 8,
      fontFamily:
        "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontFamilyCode: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
      colorBgLayout: p.bg,
      colorBgContainer: p.panel,
      colorBgElevated: p.panel2,
      colorText: p.text,
      colorTextSecondary: p.textDim,
      colorTextTertiary: isDark ? 'rgba(243,246,249,0.45)' : 'rgba(11,18,33,0.45)',
      colorBorder: p.line,
      colorBorderSecondary: p.line,
      colorFillSecondary: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(11,18,33,0.05)',
      colorFillTertiary: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(11,18,33,0.03)',
    },
    components: {
      Layout: {
        siderBg: p.panel,
        headerBg: isDark ? 'rgba(11,18,33,0.85)' : 'rgba(244,247,246,0.85)',
        bodyBg: p.bg,
      },
      Menu: {
        colorBgContainer: 'transparent',
        itemBg: 'transparent',
        itemSelectedBg: proteccio.cyanDim,
        itemHoverBg: p.panel2,
        itemSelectedColor: proteccio.cyan,
        itemColor: p.textDim,
        itemMarginBlock: 4,
        itemMarginInline: 8,
        itemPaddingInline: 14,
        itemBorderRadius: 8,
        horizontalItemSelectedColor: proteccio.cyan,
        horizontalItemHoverColor: p.text,
      },
      Card: {
        borderRadiusLG: 14,
        paddingLG: 24,
        colorBgContainer: p.panel,
      },
      Segmented: {
        itemSelectedBg: p.panel2,
        itemSelectedColor: p.text,
        itemHoverBg: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(11,18,33,0.04)',
        itemColor: p.textDim,
        trackBg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(11,18,33,0.04)',
        trackPadding: 2,
        borderRadius: 8,
        borderRadiusSM: 6,
      },
      Button: {
        borderRadius: 11,
        controlHeight: 42,
        contentFontSize: 14,
        fontWeight: 700,
        primaryShadow: 'none',
        colorPrimary: proteccio.cyan,
        colorPrimaryHover: proteccio.cyan,
        colorPrimaryActive: proteccio.cyan,
        primaryColor: '#06170D',
      },
      Input: {
        borderRadius: 10,
        controlHeight: 38,
        colorBgContainer: p.panel2,
        activeBorderColor: proteccio.cyan,
        hoverBorderColor: proteccio.cyan,
      },
      Select: {
        borderRadius: 10,
        controlHeight: 38,
        colorBgContainer: p.panel2,
        optionSelectedBg: proteccio.cyanDim,
      },
      Table: {
        borderRadius: 12,
        headerBg: p.panel2,
        headerColor: p.textDim,
        rowHoverBg: isDark ? 'rgba(46,213,115,0.05)' : 'rgba(46,213,115,0.06)',
      },
      Tag: {
        borderRadiusSM: 999,
        defaultBg: p.panel2,
      },
      Statistic: {
        contentFontSize: 28,
      },
      Typography: {
        titleMarginBottom: 0,
        titleMarginTop: 0,
      },
      Modal: {
        borderRadiusLG: 14,
        contentBg: p.panel,
        headerBg: p.panel,
      },
      Drawer: {
        colorBgElevated: p.panel,
      },
      Dropdown: {
        borderRadiusLG: 12,
        colorBgElevated: p.panel2,
      },
    },
  };
};
