import type { TagInfo } from '../types';

export const hoodieTag: TagInfo = {
  tag: 'hoodie',
  icon: 'hoodie_icon.webp',
  title: 'Smart Hoodie',
  description:
    'Developed as part of an engineering thesis and awarded a distinction. Within the project, I created a smart clothing prototype based on an NXP MCU, featuring I2C sensors (temperature, humidity, air pressure), an accelerometer, and PWM-controlled heating. The hoodie automatically adjusts its heating level to environmental conditions and features fall detection. It is also equipped with Bluetooth, enabling communication with a dedicated mobile application that I also developed as part of the project. Photo of the actual prototype presented in achievements section.',
  screens: [
    {
      path: 'main_screen_h.webp',
      label: 'main view',
    },
  ],
};
