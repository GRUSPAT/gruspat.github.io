import { memo } from 'react';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import styles from './InteractionHint.module.scss';

export const InteractionHint = memo(() => {
  const assetsLoaded = usePortfolioStore((state) => state.assetsLoaded);
  const previewTile = usePortfolioStore((state) => state.previewTile);
  const activeSection = usePortfolioStore((state) => state.activeSection);

  if (!assetsLoaded || previewTile) return null;

  const isHero = activeSection === 'hero';

  return (
    <aside className={styles.interactionHint} aria-hidden="true">
      <div className={styles.hintGroup}>
        <span className={styles.hintAction}>HOLD</span>
        <span>TO DRAG OBJECT</span>
      </div>
      <div className={styles.hintGroup}>
        {isHero ? (
          <>
            <span className={styles.hintAction}>CLICK</span>
            <span>TO SELECT</span>
          </>
        ) : (
          <>
            <span className={styles.hintAction}>DOUBLE CLICK</span>
            <span>TO OPEN PREVIEW</span>
          </>
        )}
      </div>
    </aside>
  );
});

export default InteractionHint;
