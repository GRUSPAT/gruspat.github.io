import type { TagInfo, TagId } from '../types';
import { certificationTag } from './certification';
import { graphicDesignTag } from './graphicDesign';
import { hackathonTag } from './hackathon';
import { hoodieTag } from './hoodie';
import { mgmgTag } from './mgmg';
import { photogrammetryTag } from './photogrammetry';
import { tarnow1000Tag } from './tarnow1000';
import { thesisTag } from './thesis';

export const tagsData: Record<TagId | string, TagInfo> = {
  certification: certificationTag,
  graphicDesign: graphicDesignTag,
  hackathon: hackathonTag,
  hoodie: hoodieTag,
  mgmg: mgmgTag,
  photogrammetry: photogrammetryTag,
  tarnow1000: tarnow1000Tag,
  thesis: thesisTag,
};

export {
  certificationTag,
  graphicDesignTag,
  hackathonTag,
  hoodieTag,
  mgmgTag,
  photogrammetryTag,
  tarnow1000Tag,
  thesisTag,
};
