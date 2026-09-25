import gruspatLogo from '../../assets/icons/gruspat.svg';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import styles from './TopNavigation.module.scss';

interface NavItem {
  readonly id: string;
  readonly label: string;
}

const LEFT_NAV_ITEMS: readonly NavItem[] = [
  { id: 'projects', label: 'PROJECTS' },
  { id: 'achievements', label: 'WINS' },
];

const RIGHT_NAV_ITEMS: readonly NavItem[] = [
  { id: 'hobby', label: 'HOBBY' },
  { id: 'contact', label: 'CONTACT' },
];

export const TopNavigation = () => {
  const activeSection = usePortfolioStore((state) => state.activeSection);
  const changeSection = usePortfolioStore((state) => state.changeSection);
  const isTransitioning = usePortfolioStore((state) => state.isTransitioning);

  const renderNavButton = ({ id, label }: NavItem) => {
    const isActive = activeSection === id;

    return (
      <button
        key={id}
        type="button"
        tabIndex={-1}
        disabled={isTransitioning}
        onClick={() => changeSection(id)}
        className={`${styles.navLink} ${isActive ? styles.active : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </button>
    );
  };

  const isHeroActive = activeSection === 'hero';

  return (
    <nav className={styles.topNavigation} aria-label="Main Navigation">
      <div className={styles.navGroup}>
        {LEFT_NAV_ITEMS.map(renderNavButton)}
      </div>

      <button
        type="button"
        tabIndex={-1}
        disabled={isTransitioning}
        onClick={() => changeSection('hero')}
        className={`${styles.navLink} ${styles.navLogo} ${isHeroActive ? styles.active : ''}`}
        aria-label="Home hero section"
        aria-current={isHeroActive ? 'page' : undefined}
      >
        <img src={gruspatLogo} alt="GRUSPAT" className={styles.logoImg} />
      </button>

      <div className={styles.navGroup}>
        {RIGHT_NAV_ITEMS.map(renderNavButton)}
      </div>
    </nav>
  );
};

