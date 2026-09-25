import { useState, useEffect, memo } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import gruspatLogo from '../../assets/icons/gruspat.svg';
import styles from './LoadingScreen.module.scss';

export interface LoadingScreenProps {
  assetsLoaded?: boolean;
  loadingProgress?: number;
}

export const LoadingScreen = memo(({
  assetsLoaded: propAssetsLoaded,
  loadingProgress: propLoadingProgress,
}: LoadingScreenProps) => {
  const storeAssetsLoaded = usePortfolioStore((state) => state.assetsLoaded);
  const storeLoadingProgress = usePortfolioStore((state) => state.loadingProgress);

  const assetsLoaded = propAssetsLoaded !== undefined ? propAssetsLoaded : storeAssetsLoaded;
  const loadingProgress = propLoadingProgress !== undefined ? propLoadingProgress : storeLoadingProgress;

  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (assetsLoaded) {
      setIsFadingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setIsFadingOut(false);
    }
  }, [assetsLoaded]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`${styles.container} ${isFadingOut ? styles.fadeOut : ''}`}>
      <div className={styles.hud}>
        <img
          src={gruspatLogo}
          alt="GRUSPAT"
          className={styles.logo}
        />

        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={Math.round(loadingProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading portfolio experience"
        >
          <div
            className={styles.progressFill}
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export default LoadingScreen;
