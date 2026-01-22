import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export { gsap, ScrollTrigger, ScrollToPlugin };
export const initGSAP: () => Promise<void>;
export const getGSAPConfig: () => {
  refreshRate: number;
  frameDuration: number;
  isInitialized: boolean;
};

