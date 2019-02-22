import Axis from 'seng-scroll-tracker/lib/enum/Axis';
import ScrollTracker from 'seng-scroll-tracker/lib/ScrollTracker';
import size from 'element-size';
import throttle from 'lodash/throttle';
import { ICustomScrollTrackerOptions } from '../interface/ICustomScrollTrackerOptions';

export default class CustomScrollTracker extends ScrollTracker {
  private options: ICustomScrollTrackerOptions = {
    scrollContainer: null,
    attachScrollListener: true,
    scrollThrottle: 1000 / 60,
    resizeThrottle: 200,
    onScroll: null,
  };

  constructor(
    element: HTMLElement | Window = window,
    targetAxis: Axis = Axis.Y,
    options?: ICustomScrollTrackerOptions,
  ) {
    super(element, targetAxis);
    this.options = Object.assign(this.options, options);
  }

  /**
   * Returns the target scrollContainer this ScrollTracker instance is tracking.
   */
  public get targetScrollContainer(): HTMLElement | Window {
    return this.options.scrollContainer;
  }

  /**
   * Updates the size of the viewport of the target container.
   */
  public updateSize(): void {
    if (!this.options.scrollContainer) {
      return;
    }

    const isX = this.axis === Axis.X;
    const dimensions = size(this.targetElement);
    this.viewSize = isX ? dimensions[0] : dimensions[1];

    if (this.targetElement === window) {
      const dimensions = size(document.body);
      this.scrollSize = isX ? dimensions[0] : dimensions[1];
    } else {
      const target = <HTMLElement>this.options.scrollContainer;
      this.scrollSize = isX ? target.scrollWidth : target.scrollHeight;
    }

    this.updateScrollPosition();
  }

  /**
   * Initialize scroll and resize events using jQuery. Resize events will only be used when
   * the target of ScrollTracker is 'window'. If the target is not window, updateSize() has
   * to be called manually to update the view size.
   */
  protected initEvents(): void {
    if (!this.options.scrollContainer) {
      return;
    }

    if (this.targetElement === window) {
      window.addEventListener(
        'resize',
        throttle(this.windowResizeHandler, this.options.resizeThrottle),
      );

      this.windowResizeHandler();
    } else {
      this.updateSize();
    }

    if (this.options.attachScrollListener) {
      this.targetElement.addEventListener(
        'scroll',
        throttle(this.scrollHandler, this.options.scrollThrottle),
      );
    }
  }

  /**
   * @public
   * @method update
   */
  public update(): void {
    this.updateScrollPosition();
    const scrollingBack = this.viewStart < this.lastScrollPosition;

    for (let i = 0; i < this.trackingPoints.length; i += 1) {
      this.trackingPoints[i].checkInView(scrollingBack);
    }
  }

  protected updateScrollPosition() {
    const isX = this.axis === Axis.X;
    if (this.targetElement === window) {
      this.viewStart = isX ? window.pageXOffset : window.pageYOffset;
    } else {
      const target = <HTMLElement>this.options.scrollContainer;
      this.viewStart = isX ? target.scrollLeft : target.scrollTop;
    }

    this.viewEnd = this.viewStart + this.viewSize;

    this.lastScrollPosition = this.viewStart;
  }

  /**
   * Event handler called when the target container is scrolled. Will detect the new scroll
   * position and call checkInView() on all tracking points.
   */
  protected scrollHandler = () => {
    this.update();

    if (this.options.onScroll) {
      this.options.onScroll(this.viewStart);
    }
  };
}
