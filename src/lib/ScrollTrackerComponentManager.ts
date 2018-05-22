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
  private scrollTracker: ScrollTracker = new ScrollTracker();

  /**
   * @public
   * @property scrollTrackerPoints
   * @description Here we keep track of the scrollTracker points on this page
   * @type {{}}
   */
  private scrollTrackerPoints = {};

  /**
   * description resizeEventListener
   */
  private resizeEventListener;

  /**
   * @private
   * @description Methods/properties/elements that are called on the component which can be overwritten to pass
   * along a component with a different interface.
   */
  private options: IScrollTrackerComponentManagerOptions = {
    element: 'element',
    methods: {
      enterView: 'enterView',
      leaveView: 'leaveView',
      beyondView: 'beyondView',
    },
    vars: {
      enterViewThreshold: 'enterViewThreshold',
      componentId: 'componentId',
    },
    config: {
      setDebugLabel: true,
      debugBorderColor: 'red',
      resizeDebounce: 100,
    },
  };

  constructor(options: IScrollTrackerComponentManagerOptions) {
    this.options = Object.assign(this.options, options);

    this.resizeEventListener = debounce(
      this.handleResize.bind(this),
      this.options.config.resizeDebounce,
    );
    window.addEventListener('resize', this.resizeEventListener);
  }

  /**
   * @public
   * @method addComponentToScrollTracker
   */
  public addComponentToScrollTracker(component: T): void {
    this.components[component[this.options.vars.componentId]] = component;
    const componentId = component[this.options.vars.componentId];

    // Check if it's not already added!
    if (!this.scrollTrackerPoints[componentId]) {
      // Get the correct data
      const scrollTrackerData = this.getScrollTrackerData(component);
      // console.log('addComponentsToScrollTracker', componentId, scrollTrackerData);
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

      // Check for the position on init
      if (scrollTrackerPoint.isInBounds) {
        this.handleComponentEnterView(componentId);
      }

      // Add a debug label
      setTimeout(() => this.setDebugLabel(componentId), 100);
    }
  }

  /**
   * @public
   * @method addComponentsToScrollTrackers
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
   * @public
   * @method removeComponentsFromScrollTracker
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
   * @public
   * @method removeComponentFromScrollTracker
   */
  public removeComponentFromScrollTracker(component: T): void {
    const componentId = component[this.options.vars.componentId];

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
        if (this.options.config.setDebugLabel) {
          document.body.removeChild(
            document.body.querySelector('.scroll-' + componentId.replace('.', '-')),
          );
        }

        // Remove the point from the scroll tracker
        this.scrollTracker.removePoint(scrollTrackerPoint.point);

        // Remove the point from the object
        delete this.scrollTrackerPoints[componentId];

        // todo check with Lars why this is needed, maybe logic for outside of this package.
        // Reset the transition state
        // this.components[componentId][this.options.methods.transitionOut](true);

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
   * @private
   * @method handleResize
   * @description When the window resize event is triggered  we need to recalculate the scrollTrackerPoints so the
   * enterView happens on the right moments!
   * @returns void
   */
  private handleResize(): void {
    this.updateScrollTrackerPoints();
  }

  /**
   * @private
   * @method getScrollTrackerData
   */
  private getScrollTrackerData(component: T): { height: number; yPosition: number } {
    let threshold = 0;
    let yPosition = Math.round(component[this.options.element].getBoundingClientRect().top);

    if (getComputedStyle(component[this.options.element]).position !== 'fixed') {
      yPosition += ScrollUtils.scrollTop;
      threshold = window.innerHeight * component[this.options.vars.enterViewThreshold];
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
      this.components[componentId][this.options.methods.enterView]();
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
      this.components[componentId][this.options.methods.leaveView]();
    }
  }

  /**
   * @private
   * @method handleComponentBeyondView
   * @param componentId
   * @description When the scrollbar is dragged down super fast the default enter view event might not be
   * triggered therefor we have a beyondView event!
   * @returns void
   */
  private handleComponentBeyondView(componentId: string): void {
    if (this.components[componentId]) {
      this.components[componentId][this.options.methods.beyondView]();
    }
  }

  /**
   * @private
   * @method setDebugLabel
   */
  private setDebugLabel(componentId: string): void {
    if (this.options.config.setDebugLabel) {
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
          this.options.config.debugBorderColor
        }`;
        scrollTrackerPoint.debugLabel.style.borderBottom = `1px solid ${
          this.options.config.debugBorderColor
        }`;

        scrollTrackerPoint.debugLabel.appendChild(label);
        document.body.appendChild(scrollTrackerPoint.debugLabel);
      }

      scrollTrackerPoint.debugLabel.style.height = `${scrollTrackerPoint.point.height}px`;
      scrollTrackerPoint.debugLabel.style.top = `${scrollTrackerPoint.point.position}px`;
    }
  }

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
