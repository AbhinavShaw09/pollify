import React, { useEffect, useRef, useState } from 'react';
import MinimalLoader from './MinimalLoader';

type DelayedLoaderProps = {
  loading: boolean;
  delay?: number;
  minDuration?: number;
};

const DelayedLoader: React.FC<DelayedLoaderProps> = ({
  loading,
  delay = 1000,
  minDuration = 1000,
}) => {
  const [show, setShow] = useState(false);
  const showTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let delayTimeout: NodeJS.Timeout, minTimeout: NodeJS.Timeout;

    if (loading) {
      delayTimeout = setTimeout(() => {
        setShow(true);
        showTimeRef.current = Date.now();
      }, delay);
    } else if (show) {
      const elapsed = showTimeRef.current ? Date.now() - showTimeRef.current : 0;
      minTimeout = setTimeout(() => setShow(false), Math.max(minDuration - elapsed, 0));
    } else {
      setShow(false);
    }

    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(minTimeout);
    };
  }, [loading, delay, minDuration, show]);

  return show ? <MinimalLoader /> : null;
};

export default DelayedLoader;
