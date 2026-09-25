import type { TagInfo } from '../types';

export const tarnow1000Tag: TagInfo = {
  tag: 'tarnow1000',
  icon: 'trn_icon.webp',
  title: 'Tarnów 1000',
  description:
    'A cross-platform mobile application project developed as a commission for the BWA in Tarnów. The application allows users to explore Tarnów through thematic trails related to the "Tarnów: 1000 Years of Modernity" event. As part of the project, I designed and implemented the graphical user interface as well as the key functionalities of the application. The entire app was built using Qt/QML, and the interface was designed in Figma.',
  screens: [
    {
      path: 'main_screen_trn.webp',
      label: 'intro',
    },
    {
      path: 'trn_list.webp',
      label: 'list of objects',
    },
    {
      path: 'trn_obj.webp',
      label: 'object',
    },
    {
      path: 'trn_map.webp',
      label: 'map',
    },
    {
      path: 'trn_map_obj.webp',
      label: 'object on map',
    },
  ],
};
