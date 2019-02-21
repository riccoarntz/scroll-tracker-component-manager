export interface IScrollTrackerComponentManagerOptions {
  container?: HTMLElement | Window;
  element?: string;

  enterView?: string;
  leaveView?: string;
  beyondView?: string;
  inViewProgress?: string;

  inViewProgressThreshold?: string;
  enterViewThreshold?: string;
  componentId?: string;
  hasEntered?: string;
  currentViewProgress?: string;

  setDebugLabel?: boolean;
  debugBorderColor?: string;
  resizeDebounce?: number;
  tresholdSteps?: number;

  enableSmoothScroll?: boolean;
  smoothScrollOptions?: {
    damping?: number;
    thumbMinSize?: number;
    renderByPixels?: boolean;
    alwaysShowTracks?: boolean;
    wheelEventTarget?: HTMLElement | null;
    continuousScrolling?: boolean;
    plugins?: any;
  };
}
