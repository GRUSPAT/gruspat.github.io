import { memo } from 'react';
import styles from './PreviewDock.module.scss';

export interface PreviewDockProps {
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  currentIndex: number;
  totalCount: number;
}

export const PreviewDock = memo(({
  onPrev,
  onNext,
  onClose,
  currentIndex,
  totalCount,
}: PreviewDockProps) => {
  const hasMultiple = totalCount > 1;
  const displayIndex = Math.max(0, currentIndex) + 1;

  return (
    <div
      role="toolbar"
      aria-label="Preview controls"
      className={styles.dock}
      onClick={(e) => e.stopPropagation()}
    >
      {hasMultiple && (
        <button
          type="button"
          onClick={onPrev}
          className={styles.arrowBtn}
          title="Previous object"
          aria-label="Previous object"
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}

      <button
        type="button"
        onClick={onClose}
        className={styles.closeBtn}
        aria-label="Close preview"
      >
        CLOSE
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={onNext}
            className={styles.arrowBtn}
            title="Next object"
            aria-label="Next object"
          >
            <span aria-hidden="true">›</span>
          </button>

          <span
            className={styles.counter}
            aria-live="polite"
            aria-label={`Item ${displayIndex} of ${totalCount}`}
          >
            {displayIndex}/{totalCount}
          </span>
        </>
      )}
    </div>
  );
});

export default PreviewDock;
