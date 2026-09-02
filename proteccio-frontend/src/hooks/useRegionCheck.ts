import { useState, useEffect } from 'react';

function getTimezoneBasedLkr(): boolean {
  return Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Colombo';
}

export function useRegionCheck() {
  const [isLkrUser, setIsLkrUser] = useState(false);
  const [regionCheckComplete, setRegionCheckComplete] = useState(false);

  useEffect(() => {
    setIsLkrUser(getTimezoneBasedLkr());
    setRegionCheckComplete(true);
  }, []);

  return { isLkrUser, regionCheckComplete };
}
