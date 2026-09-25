import type { Tile } from '../../store/types';
import { defineTextTile } from '../factories';

export const contactTiles: Tile[] = [
  defineTextTile({
    id: 'contact_text_mail',
    text: 'gruspat@gmail.com',
    gridPos: [0.013705284334719181, -1.3894315958023071],
    currentY: 0.01,
    size: 2,
    textRotationY: 0,
    section: 'contact',
  }),
  defineTextTile({
    id: 'contact_text_github',
    text: 'github/gruspat',
    gridPos: [0.17521679401397705, 0.07246541231870651],
    currentY: 0.01,
    size: 2,
    textRotationY: 0,
    section: 'contact',
  }),
  defineTextTile({
    id: 'contact_text_linkedin',
    text: 'In/gruspat',
    gridPos: [0.11638949066400528, 1.6129393577575684],
    currentY: 0.01,
    size: 2,
    textRotationY: 0,
    section: 'contact',
  }),
];
