import React, { memo } from 'react';
import ProteccioPageHeader from '@/components/common/ProteccioPageHeader';

interface CustomPageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CustomPageHeader: React.FC<CustomPageHeaderProps> = ({
  title,
  children,
  className = 'site-page-header',
  style = { padding: '16px 0' },
}) => {
  return <ProteccioPageHeader className={className} title={title} style={style} extra={children} />;
};

export default memo(CustomPageHeader);
