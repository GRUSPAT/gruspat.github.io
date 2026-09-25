import { memo } from 'react';
import type { TagInfo } from '../../data';
import { getImageUrl } from '../../utils/imageAssets';
import styles from './PreviewSidebar.module.scss';

export interface PreviewSidebarProps {
  tagInfo: TagInfo | null;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  currentImagePath?: string | null;
  onSelectImage: (imagePath: string) => void;
}

export const PreviewSidebar = memo(({
  tagInfo,
  isCollapsed,
  onToggleCollapse,
  currentImagePath,
  onSelectImage,
}: PreviewSidebarProps) => {
  if (!tagInfo) return null;

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      aria-label="Project details"
    >
      <button
        type="button"
        className={styles.collapsedTab}
        onClick={() => onToggleCollapse(!isCollapsed)}
        title={isCollapsed ? 'Expand description' : 'Collapse description'}
        aria-label={isCollapsed ? 'Expand description' : 'Collapse description'}
        aria-expanded={!isCollapsed}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.tabArrow}
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span className={styles.tabLabel}>DESCRIPTION</span>
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          {tagInfo.icon && (
            <img
              src={getImageUrl(tagInfo.icon)}
              alt=""
              aria-hidden="true"
              className={styles.icon}
            />
          )}
          <h3 className={styles.title}>{tagInfo.title}</h3>
        </div>

        {tagInfo.description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: tagInfo.description }}
          />
        )}

        {Array.isArray(tagInfo.screens) && tagInfo.screens.length > 0 && (
          <div className={styles.views}>
            <span className={styles.viewsLabel}>Views:</span>
            <div className={styles.viewsList}>
              {tagInfo.screens.map((screenItem, idx) => {
                const screenPath =
                  typeof screenItem === 'string'
                    ? screenItem
                    : screenItem?.path || screenItem?.url || screenItem?.src || '';
                const screenLabel =
                  typeof screenItem === 'object' && screenItem?.label
                    ? screenItem.label
                    : `View ${idx + 1}`;
                const isActive = (currentImagePath || '') === screenPath;
                return (
                  <button
                    key={screenPath || idx}
                    type="button"
                    onClick={() => onSelectImage(screenPath)}
                    className={`${styles.viewBtn} ${isActive ? styles.active : ''}`}
                    aria-pressed={isActive}
                  >
                    {screenLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
});

export default PreviewSidebar;
