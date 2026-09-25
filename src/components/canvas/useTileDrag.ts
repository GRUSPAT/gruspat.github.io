import { useState, useRef, useMemo, useEffect, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { useDrag } from '@use-gesture/react';
import { Plane, Vector3, Vector2, type Quaternion } from 'three';
import type { RapierRigidBody } from '@react-three/rapier';
import type { Tile } from '../../store/types';

interface UseTileDragParams {
  tile: Tile;
  visible: boolean;
  isSlidingIn: boolean;
  isTransitioning: boolean;
  rbRef: RefObject<RapierRigidBody>;
  baseQuaternion: Quaternion;
  dragStyle: string;
  liftHeight: number;
  setDraggingTileId: (id: string | null) => void;
  updateTileGridPos: (id: string, pos: [number, number]) => void;
}

export const useTileDrag = ({
  tile,
  visible,
  isSlidingIn,
  isTransitioning,
  rbRef,
  baseQuaternion,
  dragStyle,
  liftHeight,
  setDraggingTileId,
  updateTileGridPos,
}: UseTileDragParams) => {
  const { camera, raycaster } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const draggedRef = useRef(false);
  const dragTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), []);
  const intersectionVec = useMemo(() => new Vector3(), []);
  const ndcVec = useMemo(() => new Vector2(), []);

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const bind = useDrag(({ active, xy: [x, y], event }) => {
    if (!visible || isSlidingIn || isTransitioning) return;
    event.stopPropagation();

    if (tile.isLocked) return;

    if (active) {
      draggedRef.current = true;
      if (!isDragging) {
        setIsDragging(true);
        setDraggingTileId(tile.id);
      }

      ndcVec.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(ndcVec, camera);

      if (raycaster.ray.intersectPlane(plane, intersectionVec)) {
        if (rbRef.current) {
          rbRef.current.setNextKinematicTranslation({
            x: intersectionVec.x,
            y: tile.isFlatText ? 0.005 : (dragStyle === 'lift' ? liftHeight : 0),
            z: intersectionVec.z,
          });
          rbRef.current.setNextKinematicRotation(baseQuaternion);
        }
      }
    } else {
      setIsDragging(false);
      setDraggingTileId(null);

      if (rbRef.current) {
        const translation = rbRef.current.translation();
        updateTileGridPos(tile.id, [translation.x, translation.z]);
      }

      dragTimeoutRef.current = setTimeout(() => {
        draggedRef.current = false;
      }, 100);
    }
  }, { threshold: 10 });

  return {
    bind,
    isDragging,
    draggedRef,
  };
};
