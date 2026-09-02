import { memo } from 'react';
import proteccioIcon from '@/assets/images/proteccio-icon.png';

export const ProteccioLogoLoader = memo(() => {
  return (
    <div
      role="status"
      aria-label="Loading Proteccio"
      className="proteccio-logo-loader"
    >
      <span className="proteccio-logo-loader__ring" aria-hidden="true" />
      <img className="proteccio-logo-loader__mark" src={proteccioIcon} alt="" />
      <span
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        Loading Proteccio...
      </span>
    </div>
  );
});