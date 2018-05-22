export interface IScrollTrackerComponentManagerOptions {
  element?: string;
  methods?: {
    enterView?: string;
    leaveView?: string;
    beyondView?: string;
  };
  vars?: {
    enterViewThreshold?: string;
    componentId?: string;
  };
  config?: {
    setDebugLabel?: boolean;
    debugBorderColor?: string;
    resizeDebounce?: number;
  };
}
