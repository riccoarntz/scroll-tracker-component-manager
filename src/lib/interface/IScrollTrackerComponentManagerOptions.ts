export interface IScrollTrackerComponentManagerOptions {
  container?: HTMLElement | Window;
  element?: string;
  methods?: {
    enterView?: string;
    leaveView?: string;
    beyondView?: string;
  };
  vars?: {
    enterViewThreshold?: string;
    componentId?: string;
    hasEntered?: string;
  };
  config?: {
    setDebugLabel?: boolean;
    debugBorderColor?: string;
    resizeDebounce?: number;
  };
}
