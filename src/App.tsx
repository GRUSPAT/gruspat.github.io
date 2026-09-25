import { useEffect } from 'react';
import { usePortfolioStore } from './store/usePortfolioStore';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { LoadingScreen } from './components/overlay/LoadingScreen';
import { PreviewOverlay } from './components/overlay/PreviewOverlay';
import { TopNavigation } from './components/overlay/TopNavigation';
import { InteractionHint } from './components/overlay/InteractionHint';

export function App() {
  const loadTiles = usePortfolioStore((state) => state.loadTiles);

  useEffect(() => {
    loadTiles();
  }, [loadTiles]);

  return (
    <>
      <LoadingScreen />
      <SceneCanvas />
      <TopNavigation />
      <InteractionHint />
      <PreviewOverlay />
    </>
  );
}

export default App;
