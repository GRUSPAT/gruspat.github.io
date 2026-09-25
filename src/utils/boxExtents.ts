import { Euler, Vector3 } from 'three';

export interface RotatedBoxExtents {
  width: number;
  height: number;
  depth: number;
  minY: number;
  maxY: number;
  minX?: number;
  maxX?: number;
  minZ?: number;
  maxZ?: number;
}

export const getRotatedBoxExtents = (
  width: number,
  height: number,
  depth: number,
  rx: number,
  ry: number,
  rz: number
): RotatedBoxExtents => {
  const euler = new Euler(rx, ry, rz, 'XYZ');
  const corners = [
    new Vector3(-width / 2, -height / 2, -depth / 2),
    new Vector3(width / 2, -height / 2, -depth / 2),
    new Vector3(-width / 2, height / 2, -depth / 2),
    new Vector3(width / 2, height / 2, -depth / 2),
    new Vector3(-width / 2, -height / 2, depth / 2),
    new Vector3(width / 2, -height / 2, depth / 2),
    new Vector3(-width / 2, height / 2, depth / 2),
    new Vector3(width / 2, height / 2, depth / 2),
  ];

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  corners.forEach((c) => {
    c.applyEuler(euler);
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
    if (c.z < minZ) minZ = c.z;
    if (c.z > maxZ) maxZ = c.z;
  });

  return {
    width: maxX - minX,
    height: maxY - minY,
    depth: maxZ - minZ,
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
  };
};
