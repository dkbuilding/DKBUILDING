import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

export { gsap, ScrollTrigger, ScrollToPlugin };

export interface GSAPInitResult {
  refreshRate: number;
  frameDuration: number;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  ScrollToPlugin: typeof ScrollToPlugin;
}

export interface GSAPConfig {
  refreshRate: number;
  frameDuration: number;
  isInitialized: boolean;
}

export const initGSAP: () => Promise<GSAPInitResult | undefined>;
export const getGSAPConfig: () => GSAPConfig;
