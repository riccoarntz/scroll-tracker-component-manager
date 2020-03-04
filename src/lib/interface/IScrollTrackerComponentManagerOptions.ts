import Axis from 'seng-scroll-tracker/lib/enum/Axis';

export interface IScrollTrackerComponentManagerOptions {
  /**
   * the container that will be the scroll-area, default is the window
   */
  container?: HTMLElement | Window;
  /**
   * PropertyName of the component that contains the HTMLElement of the component.
   */
  element?: string;
  /**
   * MethodName of the component which is triggered when the component is within the viewport.
   */
  enterView?: string;
  /**
   * MethodName of the component which is triggered when the component has left the viewport.
   */
  leaveView?: string;
  /**
   * MethodName of the component which is triggered everytime it is already scrolled passed a component,
   * or when you would load a page while the scrollbar is already at the bottom or passed a component
   */
  beyondView?: string;
  /**
   * Method name of the component which is triggered every time the scroll-position changes and your component is within the viewport.
   * This method will have the parameter progress which is a number between 0-1.
   */
  inViewProgress?: string;
  /**
   * PropertyName of the component that contains a number between 0 - 1. Setting this number to for example 0.5
   * will trigger the enterView method when the component is already visible for 50% within your viewport
   */
  enterViewThreshold?: string;
  /**
   * Same as enterViewThreshold but then used as an offset from when your inViewProgress will start
   */
  inViewProgressThreshold?: string;
  /**
   * PropertyName of the component that should contain a unique string for each added component.
   */
  componentId?: string;
  /**
   * PropertyName of the component that should is by default set to false. Will be set to value if it has passed the viewport once already.
   */
  hasEntered?: string;
  /**
   * PropertyName of the component where we will store the progress of its visibility.
   */
  currentViewProgress?: string;
  /**
   * When this is set to true we will call the method inViewProgress(progress). By default this is set to false.
   */
  inViewProgressEnabled?: boolean;
  /**
   * Enable/Disable visible scroll-tracker-points for each component, this will allow to you see when the transitionIn/Out is called
   */
  setDebugLabel?: boolean;
  /**
   * Color of the scroll-tracker-points (top/bottom line).
   */
  debugBorderColor?: string;
  /**
   * Number in milliseconds used to throttle the scroll event. When enableSmoothScroll is set to true, this will be ignored.
   */
  scrollThrottle?: number;
  /**
   * Number in milliseconds to update the scroll-tracker-points with a debounce if the window is being resized.
   */
  resizeDebounce?: number;
  /**
   * the axis of the scroll-container
   */
  axis?: Axis;
  /**
   * Enable/Disable smooth-scroll, [see documentation](https://github.com/idiotWu/smooth-scrollbar/blob/HEAD/docs)
   * below. By default this is set to false
   */
  enableSmoothScroll?: boolean;
  /**
   * [see documentation](https://github.com/idiotWu/smooth-scrollbar/blob/HEAD/docs). This is only applied when enableSmoothScroll is set to true.
   */
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
