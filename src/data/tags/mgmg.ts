import type { TagInfo } from '../types';

export const mgmgTag: TagInfo = {
  tag: 'mgmg',
  icon: 'mgmg_icon.webp',
  title: 'MGMG',
  description:
    'A mobile application built with React Native that enabled time-based, multiplayer gameplay in a Wordle-style game. I implemented Firebase for the scoring system and word database, along with full user authentication via Google. The entire application was designed by me in Figma.',
  screens: [
    {
      path: 'main_screen_mg.webp',
      label: 'in game',
    },
    {
      path: 'mgmg_intro.webp',
      label: 'intro',
    },
    {
      path: 'mgmg_register.webp',
      label: 'register',
    },
    {
      path: 'mgmg_main.webp',
      label: 'main menu',
    },
    {
      path: 'mgmg_room.webp',
      label: 'waiting room',
    },
  ],
};
