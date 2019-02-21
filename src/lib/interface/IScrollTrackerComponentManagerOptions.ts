export interface IScrollTrackerComponentManagerOptions {
  container?: HTMLElement | Window;
  element?: string;

  enterView?: string;
  leaveView?: string;
  beyondView?: string;
  inViewProgress?: string;

  enterViewThreshold?: string;
  componentId?: string;
  hasEntered?: string;

  setDebugLabel?: boolean;
  debugBorderColor?: string;
  resizeDebounce?: number;
  tresholdSteps?: number;
}
