import { useEffect } from 'react';

export default function ScrollToTop({ trigger }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [trigger]);

  return null;
}
