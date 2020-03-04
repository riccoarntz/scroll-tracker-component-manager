import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import Axis from 'seng-scroll-tracker/lib/enum/Axis';
import ScrollTrackerEvent from 'seng-scroll-tracker/lib/event/ScrollTrackerEvent';
import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import { IScrollTrackerComponentManagerOptions } from './interface/IScrollTrackerComponentManagerOptions';
import CustomScrollTracker from './util/CustomScrollTracker';
import ScrollUtils from './util/ScrollUtils';

/**
 * @description: the scrollTracker needs to be able to retreive the scrollHeight + scrollTop, from 1
 * element/instance. but the when the SmoothScrollbar is used the scrollHeight and scrollTop can't be fetched from the
 * same element/instance.
 */
class SmoothScrollContainer {
  private instance: SmoothScrollbar;

  constructor(instance: SmoothScrollbar) {
    this.instance = instance;
  }

  get scrollWidth() {
    return this.instance.contentEl.scrollWidth;
  }

  get scrollLeft() {
    return this.instance.scrollLeft;
  }

  get scrollHeight() {
    return this.instance.contentEl.scrollHeight;
  }

  get scrollTop() {
    return this.instance.scrollTop;
  }
}

class HorizontalScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'horizontalScroll';

  transformDelta(delta, fromEvent) {
    if (!/wheel/.test(fromEvent.type)) {
      return delta;
    }

    const { x, y } = delta;

    return {
      y: 0,
      x: Math.abs(x) > Math.abs(y) ? x : y,
    };
  }
}

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
  private scrollTracker: CustomScrollTracker;

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
   * description: current scroll-position
   */
  private scrollPosition: number = 0;
  private windowHeight: number = window.innerHeight;
  private windowWidth: number = window.innerWidth;

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

    inViewProgressThreshold: 'inViewProgressThreshold',
    enterViewThreshold: 'enterViewThreshold',
    componentId: 'componentId',
    hasEntered: 'hasEntered',
    currentViewProgress: 'currentViewProgress',

    inViewProgressEnabled: false,
    setDebugLabel: true,
    debugBorderColor: 'red',
    scrollThrottle: 100,
    resizeDebounce: 100,
    axis: Axis.Y,

    enableSmoothScroll: false,
    smoothScrollOptions: {
      damping: 0.1,
      thumbMinSize: 20,
      renderByPixels: true,
      alwaysShowTracks: false,
      continuousScrolling: true,
      wheelEventTarget: null,
      plugins: {},
    },
  };

  /**
   * @param {IScrollTrackerComponentManagerOptions} options
   */
  constructor(options: IScrollTrackerComponentManagerOptions) {
    this.options = Object.assign(this.options, options);

    // Default options when smoothScroll is disabled
    const customScrollTrackerOptions = {
      axis: this.options.axis,
      container: <HTMLElement | Window>this.options.container,
      scrollContainer: this.options.container,
      attachScrollListener: true,
      onScroll: position => {
        this.scrollPosition = position;

        // Only do calculations if we want to know the progress per component.
        if (this.options.inViewProgressEnabled) {
          this.updateComponentsOnScroll(position);
        }
      },
      scrollThrottle: this.options.scrollThrottle,
      resizeDebounce: this.options.resizeDebounce,
    };

    // SmoothScroll Enabled
    if (this.options.enableSmoothScroll) {
      this.options.smoothScrollOptions = Object.assign(
        this.options.smoothScrollOptions,
        options.smoothScrollOptions,
      );

      // Initialize horizontal scroll plugin
      if (this.options.axis === Axis.X) {
        SmoothScrollbar.use(HorizontalScrollPlugin);
      }

      this.smoothScrollbar = SmoothScrollbar.init(
        this.options.container === window ? document.body : <HTMLElement>this.options.container,
        this.options.smoothScrollOptions,
      );

      customScrollTrackerOptions.container = this.smoothScrollbar.containerEl;
      customScrollTrackerOptions.scrollContainer = <any>new SmoothScrollContainer(
        this.smoothScrollbar,
      );
      customScrollTrackerOptions.attachScrollListener = false;
      customScrollTrackerOptions.onScroll = null;

      this.debugLabelContainer = this.smoothScrollbar.contentEl;
      // Native Scroll
    } else {
      this.debugLabelContainer =
        this.options.container === window ? document.body : <HTMLElement>this.options.container;
    }

    // Initialize the 'adapted' scroll-tracker
    this.scrollTracker = new CustomScrollTracker(
      customScrollTrackerOptions.container,
      customScrollTrackerOptions.axis,
      {
        scrollContainer: customScrollTrackerOptions.scrollContainer,
        attachScrollListener: customScrollTrackerOptions.attachScrollListener,
        scrollThrottle: customScrollTrackerOptions.scrollThrottle,
        resizeThrottle: customScrollTrackerOptions.resizeDebounce,
        onScroll: customScrollTrackerOptions.onScroll,
      },
    );

    // Add scroll listener for smooth-scroll
    if (this.smoothScrollbar) {
      this.smoothScrollbar.addListener(status => {
        this.scrollPosition = this.options.axis === Axis.X ? status.offset.x : status.offset.y;

        // Only do calculations if we want to know the progress per component.
        if (this.options.inViewProgressEnabled) {
          this.updateComponentsOnScroll(this.scrollPosition);
        }

        this.scrollTracker.update();
      });
    }

    this.resizeEventListener = debounce(this.handleResize.bind(this), this.options.resizeDebounce);
    window.addEventListener('resize', this.resizeEventListener);
  }

  /**
   * @private
   * @method updateComponentsOnScroll
   */
  private updateComponentsOnScroll(position: number): void {
    Object.keys(this.scrollTrackerPoints).forEach(componentId => {
      this.calculateComponentProgress(componentId, position);
    });
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
        scrollTrackerData.position,
        scrollTrackerData.size,
      );

      // Store the reference
      this.scrollTrackerPoints[componentId] = {
        point: scrollTrackerPoint,
        enterViewListener: this.handleComponentEnterView.bind(this, componentId),
        leaveViewListener: this.handleComponentLeaveView.bind(this, componentId),
        beyondViewListener: this.handleComponentBeyondView.bind(this, componentId),
      };

      scrollTrackerPoint.addEventListener(
        ScrollTrackerEvent.types.ENTER_VIEW,
        this.scrollTrackerPoints[componentId].enterViewListener,
      );

      scrollTrackerPoint.addEventListener(
        ScrollTrackerEvent.types.LEAVE_VIEW,
        this.scrollTrackerPoints[componentId].leaveViewListener,
      );

      scrollTrackerPoint.addEventListener(
        ScrollTrackerEvent.types.SCROLLED_BEYOND,
        this.scrollTrackerPoints[componentId].beyondViewListener,
      );

      setTimeout(() => {
        // Check for the position on init
        if (scrollTrackerPoint.isInView) {
          this.handleComponentEnterView(componentId);
        } else if (scrollTrackerPoint.hasScrolledBeyond) {
          this.handleComponentBeyondView(componentId);
        }

        this.calculateComponentProgress(componentId, this.scrollPosition);
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
          ScrollTrackerEvent.types.ENTER_VIEW,
          scrollTrackerPoint.enterViewListener,
        );
        scrollTrackerPoint.point.removeEventListener(
          ScrollTrackerEvent.types.LEAVE_VIEW,
          scrollTrackerPoint.leaveViewListener,
        );

        scrollTrackerPoint.point.removeEventListener(
          ScrollTrackerEvent.types.SCROLLED_BEYOND,
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

      scrollTrackerPoint.position = scrollTrackerData.position;
      scrollTrackerPoint.height = scrollTrackerData.size;

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
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;

    this.updateScrollTrackerPoints();
  }

  /**
   *
   * @param {T} component
   * description Calculate and return the height and Yposition of the component, plus/minus it's threshold if that
   * is set(position and height is used for adding to the scroll-tracker to determine enter/leave view points.
   * @returns {{height: number; yPosition: number}}
   */
  private getScrollTrackerData(component: T): { size: number; position: number } {
    let threshold = 0;
    const componentBoundingClientRect = component[this.options.element].getBoundingClientRect();
    let componentSize = componentBoundingClientRect.height;

    let basePosition: number = 0;
    if (this.options.container !== window) {
      const containerRect = (<HTMLElement>this.options.container).getBoundingClientRect();
      basePosition = this.options.axis === Axis.X ? containerRect.left : containerRect.top;
    }

    let position = Math.round(componentBoundingClientRect.top - basePosition);
    if (this.options.axis === Axis.X) {
      position = Math.round(componentBoundingClientRect.left - basePosition);
      componentSize = componentBoundingClientRect.width;
    }

    if (getComputedStyle(component[this.options.element]).position !== 'fixed') {
      position += this.getScroll();
      threshold = this.getTresholdSize(component, component[this.options.enterViewThreshold]);
    }

    return {
      position: Math.max(position + threshold, 0),
      size: componentSize - threshold,
    };
  }

  /**
   * @public
   * @method getScrollLeft
   */
  public getScrollLeft(): number {
    if (this.options.enableSmoothScroll) {
      return this.smoothScrollbar.scrollLeft;
    }

    if (this.options.container === window) {
      return ScrollUtils.scrollLeft;
    }

    return (<HTMLElement>this.options.container).scrollLeft;
  }

  /**
   * @public
   * @method getScrollTop
   */
  public getScrollTop(): number {
    if (this.options.enableSmoothScroll) {
      return this.smoothScrollbar.scrollTop;
    }

    if (this.options.container === window) {
      return ScrollUtils.scrollTop;
    }

    return (<HTMLElement>this.options.container).scrollTop;
  }

  /**
   * @private
   * @method getScroll
   */
  private getScroll(): number {
    if (this.options.axis === Axis.X) {
      return this.getScrollLeft();
    }

    return this.getScrollTop();
  }

  /**
   * @private
   * @method getTresholdSize
   */
  private getTresholdSize(component: T, thresholdFactor: number = 0): number {
    let threshold = 0;

    if (getComputedStyle(component[this.options.element]).position !== 'fixed') {
      if (this.options.axis === Axis.X) {
        threshold = this.windowWidth * thresholdFactor;
      } else {
        threshold = this.windowHeight * thresholdFactor;
      }
    }

    return threshold;
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
    const component = this.components[componentId];

    if (
      this.options.inViewProgressEnabled &&
      this.components[componentId] &&
      this.components[componentId][this.options.inViewProgress]
    ) {
      const enterViewThreshold = this.getTresholdSize(
        component,
        component[this.options.enterViewThreshold],
      );
      const inViewProgressThreshold = this.getTresholdSize(
        component,
        component[this.options.inViewProgressThreshold],
      );
      const point = this.scrollTrackerPoints[componentId].point;

      // The points are created with the enterViewThreshold. The progress can have a different threshold therefore we
      // want to subtract the enterViewThreshold before doing calculations.
      const pointPosition = point.position - enterViewThreshold + inViewProgressThreshold;
      const pointHeight = point.pointHeight + enterViewThreshold - inViewProgressThreshold;

      const viewSize = point.pointTracker.viewSize;
      const distance = viewSize + pointHeight;
      const viewEnd = position + viewSize;

      const progress = Math.min(Math.max(0, (viewEnd - pointPosition) / distance), 1);

      if (this.components[componentId][this.options.currentViewProgress] !== progress) {
        this.components[componentId][this.options.currentViewProgress] = progress;
        this.components[componentId][this.options.inViewProgress](progress);
      }
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

        scrollTrackerPoint.debugLabel.appendChild(label);
        this.debugLabelContainer.appendChild(scrollTrackerPoint.debugLabel);

        if (this.options.axis === Axis.X) {
          scrollTrackerPoint.debugLabel.style.width = `${scrollTrackerPoint.point.height}px`;
          scrollTrackerPoint.debugLabel.style.left = `${scrollTrackerPoint.point.position}px`;
          scrollTrackerPoint.debugLabel.style.top = 0;
          scrollTrackerPoint.debugLabel.style.borderLeft = `1px solid ${
            this.options.debugBorderColor
          }`;
          scrollTrackerPoint.debugLabel.style.borderRight = `1px solid ${
            this.options.debugBorderColor
          }`;
        } else {
          scrollTrackerPoint.debugLabel.style.height = `${scrollTrackerPoint.point.height}px`;
          scrollTrackerPoint.debugLabel.style.top = `${scrollTrackerPoint.point.position}px`;
          scrollTrackerPoint.debugLabel.style.borderTop = `1px solid ${
            this.options.debugBorderColor
          }`;
          scrollTrackerPoint.debugLabel.style.borderBottom = `1px solid ${
            this.options.debugBorderColor
          }`;
        }
      }
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

    if (this.smoothScrollbar) {
      this.smoothScrollbar.destroy();
    }
  }
}
