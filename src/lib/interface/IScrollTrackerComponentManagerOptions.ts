export interface IScrollTrackerComponentManagerOptions {
  element: string;
  methods: {
    transitionIn: string;
    transitionOut: string;
    startLoopingAnimation: string;
    stopLoopingAnimation: string;
  };
  vars: {
    transitionInThreshold: string;
    componentId: string;
  };
  config: {
    setDebugLabel?: boolean;
    debugBorderColor?: string;
    resizeDebounce?: number;
  };
}
