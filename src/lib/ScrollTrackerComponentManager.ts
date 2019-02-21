import SmoothScrollbar from 'smooth-scrollbar';
import { IScrollTrackerComponentManagerOptions } from './interface/IScrollTrackerComponentManagerOptions';
import ScrollTracker from 'seng-scroll-tracker/lib/ScrollTracker';
import ScrollTrackerEvent from 'seng-scroll-tracker/lib/event/ScrollTrackerEvent';
import ScrollUtils from './util/ScrollUtils';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import debounce from 'lodash/debounce';

export default class ScrollTrackerComponentManager<T> {
  /**
   * @description The collection of scroll components
   */
  private components: { [key: string]: T } = {};

  /**
   * @public
   * @property scrollTracker
   * @description Here initiate the scrollTracker, the scrollTracker manages when a component is in view or
   * when it's not!
   */
  private scrollTracker: ScrollTracker;

  /**
   * @private
   * @property debugLabelContainer
   * @description The container that holds the debug labels if they are injected into the page
   */
  private debugLabelContainer: HTMLElement;

  /**
   * @public
   * @property scrollTrackerPoints
   * @description Here we keep track of the scrollTracker points on this page
   * @type {{}}
   */
  private scrollTrackerPoints: { [key: string]: any } = {};

  /**
   * description resizeEventListener
   */
  private resizeEventListener;

  public smoothScrollbar: SmoothScrollbar;

  /**
   * @private
   * @description Methods/properties/elements that are called on the component which can be overwritten to pass
   * along a component with a different interface.
   */
  private options: IScrollTrackerComponentManagerOptions = {
    container: window,
    element: 'element',

    enterView: 'enterView',
    leaveView: 'leaveView',
    beyondView: 'beyondView',
    inViewProgress: 'inViewProgress',

    enterViewThreshold: 'enterViewThreshold',
    componentId: 'componentId',
    hasEntered: 'hasEntered',

    setDebugLabel: true,
    debugBorderColor: 'red',
    resizeDebounce: 100,
  };

  /**
   * @param {IScrollTrackerComponentManagerOptions} options
   */
  constructor(options: IScrollTrackerComponentManagerOptions) {
    this.options = Object.assign(this.options, options);
    this.smoothScrollbar = SmoothScrollbar.init(<HTMLElement>this.options.container, {
      damping: 0.1,
      thumbMinSize: 20,
      renderByPixels: true,
      alwaysShowTracks: true,
      continuousScrolling: true,
    });

    this.scrollTracker = new ScrollTracker(<any>this.smoothScrollbar);
    // this.debugLabelContainer =
    //   this.options.container === window ? document.body : <HTMLElement>this.options.container;
    this.debugLabelContainer = this.smoothScrollbar.contentEl;
    this.resizeEventListener = debounce(this.handleResize.bind(this), this.options.resizeDebounce);

    this.smoothScrollbar.addListener(status => {
      Object.keys(this.scrollTrackerPoints).forEach(componentId => {
        if (this.scrollTrackerPoints[componentId].point.isInView) {
          this.calculateComponentProgress(componentId, status.offset.y);
        }
      });

      this.scrollTracker.onScrollChange();
    });

    window.addEventListener('resize', this.resizeEventListener);
  }

  /**
   * @description Here we will add the position+end-position of the component to the scroll-tracker, when we are
   * scrolling the window and once these positions entered/left the viewport we will trigger the corresponding
   * method on the added component.
   * @param {T} component
   */
  public addComponentToScrollTracker(component: T): void {
    this.components[component[this.options.componentId]] = component;
    const componentId = component[this.options.componentId];

    // Check if it's not already added!
    if (!this.scrollTrackerPoints[componentId]) {
      // Get the correct data
      const scrollTrackerData = this.getScrollTrackerData(component);
      const scrollTrackerPoint = this.scrollTracker.addPoint(
        scrollTrackerData.yPosition,
        scrollTrackerData.height,
      );

      // Store the reference
      this.scrollTrackerPoints[componentId] = {
        point: scrollTrackerPoint,
        enterViewListener: this.handleComponentEnterView.bind(this, componentId),
        leaveViewListener: this.handleComponentLeaveView.bind(this, componentId),
        beyondViewListener: this.handleComponentBeyondView.bind(this, componentId),
      };

      scrollTrackerPoint.addEventListener(
        ScrollTrackerEvent.ENTER_VIEW,
        this.scrollTrackerPoints[componentId].enterViewListener,
      );

      scrollTrackerPoint.addEventListener(
        ScrollTrackerEvent.LEAVE_VIEW,
        this.scrollTrackerPoints[componentId].leaveViewListener,
      );

      scrollTrackerPoint.addEventListener(
        ScrollTrackerEvent.SCROLLED_BEYOND,
        this.scrollTrackerPoints[componentId].beyondViewListener,
      );

      setTimeout(() => {
        // Check for the position on init
        if (scrollTrackerPoint.isInView) {
          this.handleComponentEnterView(componentId);
          this.calculateComponentProgress(componentId, this.smoothScrollbar.scrollTop);
        } else if (scrollTrackerPoint.hasScrolledBeyond) {
          this.handleComponentBeyondView(componentId);
        }
      }, 100);

      // Add a debug label
      setTimeout(() => this.setDebugLabel(componentId), 100);
    }
  }

  /**
   * @description Here you can pass a group (Array or Object) of components to the scroll-tracker, we basically loop
   * through the components and add it via the 'singular-method' addComponentToScrollTracker.
   * @param {Array<T> | {[p: string]: T}} components
   */
  public addComponentsToScrollTrackers(components: Array<T> | { [key: string]: T }): void {
    if (isArray(components)) {
      components.forEach((component: T) => {
        this.addComponentToScrollTracker(component);
      });
    } else if (isObject(components)) {
      Object.keys(components).forEach(componentId => {
        this.addComponentToScrollTracker(components[componentId]);
      });
    }
  }

  /**
   * @description Here you can pass a group (Array or Object) of components which will be removed from the
   * scroll-tracker, we basically loop through the components and remove it via the 'singular-method'
   * removeComponentFromScrollTracker.
   * @param {Array<T> | {[p: string]: T}} components
   */
  public removeComponentsFromScrollTracker(components: Array<T> | { [key: string]: T }): void {
    if (isArray(components)) {
      components.forEach((component: T) => {
        this.removeComponentFromScrollTracker(component);
      });
    } else if (isObject(components)) {
      Object.keys(components).forEach(componentId => {
        this.removeComponentFromScrollTracker(components[componentId]);
      });
    }
  }

  /**
   * @description Here we will remove the component from the scroll-tracker, and clean up all it's
   * listeners/debug-labels etc.
   * @param {T} component
   */
  public removeComponentFromScrollTracker(component: T): void {
    const componentId = component[this.options.componentId];

    if (componentId) {
      const scrollTrackerPoint = this.scrollTrackerPoints[componentId];

      if (scrollTrackerPoint) {
        scrollTrackerPoint.point.removeEventListener(
          ScrollTrackerEvent.ENTER_VIEW,
          scrollTrackerPoint.enterViewListener,
        );
        scrollTrackerPoint.point.removeEventListener(
          ScrollTrackerEvent.LEAVE_VIEW,
          scrollTrackerPoint.leaveViewListener,
        );

        scrollTrackerPoint.point.removeEventListener(
          ScrollTrackerEvent.SCROLLED_BEYOND,
          scrollTrackerPoint.beyondViewListener,
        );

        // Remove the debug label
        if (this.options.setDebugLabel) {
          this.debugLabelContainer.removeChild(
            this.debugLabelContainer.querySelector('.scroll-' + componentId.replace('.', '-')),
          );
        }

        // Remove the point from the scroll tracker
        this.scrollTracker.removePoint(scrollTrackerPoint.point);

        // Remove the point from the object
        delete this.scrollTrackerPoints[componentId];

        // Remove the block reference
        delete this.components[componentId];
      } else {
        throw new Error(
          `[ScrollTrackerComponentManager] Component with id: [${componentId}] does not exist, unable to remove it`,
        );
      }
    }
  }

  /**
   * @private
   * @description Recalculate the scrollTrackerPoints so the enterView happens on the right moment!
   * @method updateScrollTrackerPoints
   */
  private updateScrollTrackerPoints(): void {
    Object.keys(this.scrollTrackerPoints).forEach((componentId: string) => {
      // Get the correct data
      const scrollTrackerPoint = this.scrollTrackerPoints[componentId].point;
      const scrollComponent = this.components[componentId];

      // Fetch the new dimensions
      const scrollTrackerData = this.getScrollTrackerData(scrollComponent);

      scrollTrackerPoint.position = scrollTrackerData.yPosition;
      scrollTrackerPoint.height = scrollTrackerData.height;

      this.setDebugLabel(componentId);
    });
  }

  /**
   * @public
   * @method handleResize
   * @description When the window resize event is triggered  we need to recalculate the scrollTrackerPoints so the
   * enterView happens on the right moments!
   * @returns void
   */
  public handleResize(): void {
    this.updateScrollTrackerPoints();
  }

  /**
   *
   * @param {T} component
   * description Calculate and return the height and Yposition of the component, plus/minus it's threshold if that
   * is set(position and height is used for adding to the scroll-tracker to determine enter/leave view points.
   * @returns {{height: number; yPosition: number}}
   */
  private getScrollTrackerData(component: T): { height: number; yPosition: number } {
    let threshold = 0;
    const baseY =
      this.options.container === window
        ? 0
        : (<HTMLElement>this.options.container).getBoundingClientRect().top;
    let yPosition = Math.round(baseY + component[this.options.element].getBoundingClientRect().top);

    if (getComputedStyle(component[this.options.element]).position !== 'fixed') {
      yPosition +=
        this.options.container === window
          ? ScrollUtils.scrollTop
          : (<HTMLElement>this.options.container).scrollTop;
      threshold = window.innerHeight * (component[this.options.enterViewThreshold] || 0);
    }

    return {
      yPosition: Math.max(yPosition + threshold, 0),
      height: component[this.options.element].offsetHeight - threshold,
    };
  }

  /**
   * @private
   * @method handleComponentEnterView
   * @param componentId
   * @description When a scrollComponent enters the view.
   * @returns void
   */
  private handleComponentEnterView(componentId: string): void {
    if (this.components[componentId]) {
      this.components[componentId][this.options.enterView]();
      this.components[componentId][this.options.hasEntered] = true;
    }
  }

  private calculateComponentProgress(componentId: string, position: number): void {
    if (this.components[componentId] && this.components[componentId][this.options.inViewProgress]) {
      const point = this.scrollTrackerPoints[componentId].point;

      const viewSize = point.pointTracker.viewSize;
      const distance = viewSize + point.pointHeight;
      const viewEnd = position + viewSize;

      const progress = Math.min(Math.max(0, (viewEnd - point.position) / distance), 1);
      this.components[componentId][this.options.inViewProgress](progress);
    }
  }

  /**
   * @private
   * @method handleComponentLeaveView
   * @description When a scrollComponent leaves the view.
   * @param componentId
   * @returns void
   */
  private handleComponentLeaveView(componentId: string): void {
    if (this.components[componentId]) {
      this.components[componentId][this.options.leaveView]();
    }
  }

  /**
   * @private
   * @method handleComponentBeyondView
   * @description Called everytime it is already scrolled passed a component, or when you would load a page while
   * the scrollbar is already at the bottom or passed a component.
   * @param componentId
   * @returns void
   */
  private handleComponentBeyondView(componentId: string): void {
    if (this.components[componentId]) {
      this.components[componentId][this.options.beyondView]();
      this.components[componentId][this.options.hasEntered] = true;
    }
  }

  /**
   * @description We add a scroll-tracker-point with it's componentId in the DOM for debugging purpose(if enabled).
   * This indicates visually where/when the enter/leaveView methods points are fired.
   * @param {string} componentId
   */
  private setDebugLabel(componentId: string): void {
    if (this.options.setDebugLabel) {
      const scrollTrackerPoint = this.scrollTrackerPoints[componentId];

      if (!scrollTrackerPoint.debugLabel) {
        scrollTrackerPoint.debugLabel = document.createElement('div');
        scrollTrackerPoint.debugLabel.classList.add('scroll-tracker-point');
        scrollTrackerPoint.debugLabel.classList.add(`scroll-${componentId.replace('.', '-')}`);

        const label = document.createElement('p');
        label.innerHTML = `scroll-tracker-point:${componentId}`;

        scrollTrackerPoint.debugLabel.style.position = `absolute`;
        scrollTrackerPoint.debugLabel.style.zIndex = '99999';
        scrollTrackerPoint.debugLabel.style.borderTop = `1px solid ${
          this.options.debugBorderColor
        }`;
        scrollTrackerPoint.debugLabel.style.borderBottom = `1px solid ${
          this.options.debugBorderColor
        }`;

        scrollTrackerPoint.debugLabel.appendChild(label);
        this.debugLabelContainer.appendChild(scrollTrackerPoint.debugLabel);
      }

      scrollTrackerPoint.debugLabel.style.height = `${scrollTrackerPoint.point.height}px`;
      scrollTrackerPoint.debugLabel.style.top = `${scrollTrackerPoint.point.position}px`;
    }
  }

  /**
   * @description This will remove all added components from the scroll-tracker and destruct the scroll-tracker.
   */
  public dispose() {
    window.removeEventListener('resize', this.resizeEventListener);
    this.resizeEventListener = null;

    if (this.components) {
      this.removeComponentsFromScrollTracker(this.components);
      this.components = null;
    }

    if (this.scrollTracker) {
      this.scrollTracker.dispose();
      this.scrollTracker = null;
    }
  }
}
