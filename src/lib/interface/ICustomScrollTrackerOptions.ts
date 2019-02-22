export interface ICustomScrollTrackerOptions {
  scrollContainer: HTMLElement | Window;
  attachScrollListener?: boolean;
  scrollThrottle?: number;
  resizeThrottle?: number;
  onScroll?: Function;
}
