// import { IScrollTrackerComponentManagerOptions } from './interface/IScrollTrackerComponentManagerOptions';
// import isArray from 'lodash/isArray';
// import isObject from 'lodash/isObject';
// import debounce from 'lodash/debounce';
//
// export default class Foo<T> {
//   /**
//    * @description The collection of scroll components
//    */
//   private components: { [key: string]: T } = {};
//   private observerEntries: { [key: string]: IntersectionObserverEntry } = {};
//
//   /**
//    * @private
//    * @property debugLabelContainer
//    * @description The container that holds the debug labels if they are injected into the page
//    */
//   private debugLabelContainer: HTMLElement;
//
//   /**
//    * description resizeEventListener
//    */
//   private resizeEventListener;
//
//   private intersectionObserver: IntersectionObserver;
//
//   /**
//    * @private
//    * @description Methods/properties/elements that are called on the component which can be overwritten to pass
//    * along a component with a different interface.
//    */
//   private options: IScrollTrackerComponentManagerOptions = {
//     container: window,
//     element: 'element',
//
//     enterView: 'enterView',
//     leaveView: 'leaveView',
//     beyondView: 'beyondView',
//
//     enterViewThreshold: 'enterViewThreshold',
//     componentId: 'componentId',
//     hasEntered: 'hasEntered',
//
//     setDebugLabel: true,
//     debugBorderColor: 'red',
//     resizeDebounce: 100,
//     tresholdSteps: 4,
//   };
//
//   /**
//    * @param {IScrollTrackerComponentManagerOptions} options
//    */
//   constructor(options: IScrollTrackerComponentManagerOptions) {
//     this.options = Object.assign(this.options, options);
//     this.debugLabelContainer = this.options.container === window ? document.body : <HTMLElement>this.options.container;
//
//     console.log(this.debugLabelContainer);
//
//     this.intersectionObserver = new IntersectionObserver(this.handleInterSect.bind(this), {
//       root: this.options.container === window ? null : <HTMLElement>this.options.container,
//       rootMargin: `0px`,
//       threshold: this.buildTresholdList(),
//     });
//
//     this.resizeEventListener = debounce(
//       this.handleResize.bind(this),
//       this.options.resizeDebounce,
//     );
//     window.addEventListener('resize', this.resizeEventListener);
//   }
//
//   /**
//    * @private
//    * @method buildTresholdList
//    */
//   private buildTresholdList(): Array<number> {
//     const thresholds = [];
//
//     for (let i = 1; i <= this.options.tresholdSteps; i++) {
//       const ratio = i / this.options.tresholdSteps;
//       thresholds.push(ratio);
//     }
//
//     thresholds.push(0);
//     return thresholds;
//   }
//
//   /**
//    * @private
//    * @method handleInterSect
//    */
//   private handleInterSect(entries): void {
//     entries.forEach(entry => {
//       const component = this.getComponentForElement(entry.target);
//       // console.log('handleInterSect', entry.intersectionRatio * 100, component);
//
//       if (component) {
//         const componentId = component[this.options.componentId];
//         const previousEntry = this.observerEntries[componentId];
//         const componentEnterViewThreshold = component[this.options.enterViewThreshold];
//
//         const { top, height, bottom } =  entry.boundingClientRect;
//
//         console.log(entry.isIntersecting, top <= height, bottom >= 0, componentId, entry, entry.boundingClientRect);
//
//         // isInViewport
//         if(entry.isIntersecting) {
//           // isInViewport(enterThresholdArea, percentage)
//
//         // outside viewport
//         } else {
//           // check leave or beyondView
//         }
//
//         // console.log(entry.boundingClientRect, componentId);
//
//         // entry.boundingClientRect
//
//         if (entry.intersectionRatio >= componentEnterViewThreshold) {
//           if (previousEntry) {
//             if (previousEntry.intersectionRatio < componentEnterViewThreshold) {
//               // this.handleComponentEnterView(componentId);
//             }
//           } else {
//             // this.handleComponentEnterView(componentId);
//           }
//         } else if (entry.intersectionRatio <= 0 && previousEntry && previousEntry.intersectionRatio > 0) {
//           // this.handleComponentLeaveView(componentId);
//         }
//
//         this.observerEntries[componentId] = entry;
//       }
//       // if (entry.intersectionRatio > prevRatio) {
//       //   entry.target.style.backgroundColor = increasingColor.replace("ratio", entry.intersectionRatio);
//       // } else {
//       //   entry.target.style.backgroundColor = decreasingColor.replace("ratio", entry.intersectionRatio);
//       // }
//       //
//       // prevRatio = entry.intersectionRatio;
//     });
//   }
//
//   /**
//    * @private
//    * @method getComponentForElement
//    */
//   private getComponentForElement(element: HTMLElement): T {
//     return this.components[Object.keys(this.components).find((key) => this.components[key][this.options.element] === element)];
//   }
//
//   /**
//    * @description Here we will add the position+end-position of the component to the scroll-tracker, when we are
//    * scrolling the window and once these positions entered/left the viewport we will trigger the corresponding
//    * method on the added component.
//    * @param {T} component
//    */
//   public addComponentToScrollTracker(component: T): void {
//     this.components[component[this.options.componentId]] = component;
//     const componentId = component[this.options.componentId];
//
//     this.intersectionObserver.observe(component[this.options.element]);
//
//     // Check if it's not already added!
//     if (!this.observerEntries[componentId]) {
//
//       // // Get the correct data
//       // const scrollTrackerData = this.getScrollTrackerData(component);
//       // const scrollTrackerPoint = this.scrollTracker.addPoint(
//       //   scrollTrackerData.yPosition,
//       //   scrollTrackerData.height,
//       // );
//       //
//       // // Store the reference
//       // this.scrollTrackerPoints[componentId] = {
//       //   point: scrollTrackerPoint,
//       //   enterViewListener: this.handleComponentEnterView.bind(this, componentId),
//       //   leaveViewListener: this.handleComponentLeaveView.bind(this, componentId),
//       //   beyondViewListener: this.handleComponentBeyondView.bind(this, componentId),
//       // };
//       //
//       // scrollTrackerPoint.addEventListener(
//       //   ScrollTrackerEvent.ENTER_VIEW,
//       //   this.scrollTrackerPoints[componentId].enterViewListener,
//       // );
//       //
//       // scrollTrackerPoint.addEventListener(
//       //   ScrollTrackerEvent.LEAVE_VIEW,
//       //   this.scrollTrackerPoints[componentId].leaveViewListener,
//       // );
//       //
//       // scrollTrackerPoint.addEventListener(
//       //   ScrollTrackerEvent.SCROLLED_BEYOND,
//       //   this.scrollTrackerPoints[componentId].beyondViewListener,
//       // );
//       //
//       // setTimeout(() => {
//       //   // Check for the position on init
//       //   if (scrollTrackerPoint.isInView) {
//       //     this.handleComponentEnterView(componentId);
//       //   } else if (scrollTrackerPoint.hasScrolledBeyond) {
//       //     this.handleComponentBeyondView(componentId);
//       //   }
//       // }, 100);
//
//       // Add a debug label
//       // setTimeout(() => this.setDebugLabel(componentId), 100);
//     }
//   }
//
//   /**
//    * @description Here you can pass a group (Array or Object) of components to the scroll-tracker, we basically loop
//    * through the components and add it via the 'singular-method' addComponentToScrollTracker.
//    * @param {Array<T> | {[p: string]: T}} components
//    */
//   public addComponentsToScrollTrackers(components: Array<T> | { [key: string]: T }): void {
//     if (isArray(components)) {
//       components.forEach((component: T) => {
//         this.addComponentToScrollTracker(component);
//       });
//     } else if (isObject(components)) {
//       Object.keys(components).forEach(componentId => {
//         this.addComponentToScrollTracker(components[componentId]);
//       });
//     }
//   }
//
//   /**
//    * @description Here you can pass a group (Array or Object) of components which will be removed from the
//    * scroll-tracker, we basically loop through the components and remove it via the 'singular-method'
//    * removeComponentFromScrollTracker.
//    * @param {Array<T> | {[p: string]: T}} components
//    */
//   public removeComponentsFromScrollTracker(components: Array<T> | { [key: string]: T }): void {
//     if (isArray(components)) {
//       components.forEach((component: T) => {
//         this.removeComponentFromScrollTracker(component);
//       });
//     } else if (isObject(components)) {
//       Object.keys(components).forEach(componentId => {
//         this.removeComponentFromScrollTracker(components[componentId]);
//       });
//     }
//   }
//
//   /**
//    * @description Here we will remove the component from the scroll-tracker, and clean up all it's
//    * listeners/debug-labels etc.
//    * @param {T} component
//    */
//   public removeComponentFromScrollTracker(component: T): void {
//     const componentId = component[this.options.componentId];
//
//     if (componentId) {
//       const component = this.components[componentId];
//
//       if (component) {
//
//         // // Remove the debug label
//         // if (this.options.setDebugLabel) {
//         //   this.debugLabelContainer.removeChild(
//         //     this.debugLabelContainer.querySelector('.scroll-' + componentId.replace('.', '-')),
//         //   );
//         // }
//
//         // Unobserve intersection changes for this element/component
//         this.intersectionObserver.unobserve(component[this.options.element]);
//
//         // Remove the observerEntry
//         delete this.observerEntries[componentId];
//
//         // Remove the block reference
//         delete this.components[componentId];
//       } else {
//         throw new Error(
//           `[ScrollTrackerComponentManager] Component with id: [${componentId}] does not exist, unable to remove it`,
//         );
//       }
//     }
//   }
//
//   /**
//    * @private
//    * @description Recalculate the scrollTrackerPoints so the enterView happens on the right moment!
//    * @method updateScrollTrackerPoints
//    */
//   private updateScrollTrackerPoints(): void {
//
//   }
//
//   /**
//    * @public
//    * @method handleResize
//    * @description When the window resize event is triggered  we need to recalculate the scrollTrackerPoints so the
//    * enterView happens on the right moments!
//    * @returns void
//    */
//   public handleResize(): void {
//     this.updateScrollTrackerPoints();
//   }
//
//   /**
//    * @private
//    * @method handleComponentEnterView
//    * @param componentId
//    * @description When a scrollComponent enters the view.
//    * @returns void
//    */
//   private handleComponentEnterView(componentId: string): void {
//     if (this.components[componentId]) {
//       this.components[componentId][this.options.enterView]();
//       this.components[componentId][this.options.hasEntered] = true;
//     }
//   }
//
//   /**
//    * @private
//    * @method handleComponentLeaveView
//    * @description When a scrollComponent leaves the view.
//    * @param componentId
//    * @returns void
//    */
//   private handleComponentLeaveView(componentId: string): void {
//     if (this.components[componentId]) {
//       this.components[componentId][this.options.leaveView]();
//     }
//   }
//
//   //
//   // /**
//   //  * @private
//   //  * @method handleComponentBeyondView
//   //  * @description Called everytime it is already scrolled passed a component, or when you would load a page while
//   //  * the scrollbar is already at the bottom or passed a component.
//   //  * @param componentId
//   //  * @returns void
//   //  */
//   // private handleComponentBeyondView(componentId: string): void {
//   //   if (this.components[componentId]) {
//   //     this.components[componentId][this.options.beyondView]();
//   //     this.components[componentId][this.options.hasEntered] = true;
//   //   }
//   // }
//
//   /**
//    * @description We add a scroll-tracker-point with it's componentId in the DOM for debugging purpose(if enabled).
//    * This indicates visually where/when the enter/leaveView methods points are fired.
//    * @param {string} componentId
//    */
//   // private setDebugLabel(componentId: string): void {
//   //   console.log('setDebugLabel', componentId);
//   //   // if (this.options.setDebugLabel) {
//   //   //   const scrollTrackerPoint = this.scrollTrackerPoints[componentId];
//   //   //
//   //   //   if (!scrollTrackerPoint.debugLabel) {
//   //   //     scrollTrackerPoint.debugLabel = document.createElement('div');
//   //   //     scrollTrackerPoint.debugLabel.classList.add('scroll-tracker-point');
//   //   //     scrollTrackerPoint.debugLabel.classList.add(`scroll-${componentId.replace('.', '-')}`);
//   //   //
//   //   //     const label = document.createElement('p');
//   //   //     label.innerHTML = `scroll-tracker-point:${componentId}`;
//   //   //
//   //   //     scrollTrackerPoint.debugLabel.style.position = `absolute`;
//   //   //     scrollTrackerPoint.debugLabel.style.zIndex = '99999';
//   //   //     scrollTrackerPoint.debugLabel.style.borderTop = `1px solid ${
//   //   //       this.options.debugBorderColor
//   //   //       }`;
//   //   //     scrollTrackerPoint.debugLabel.style.borderBottom = `1px solid ${
//   //   //       this.options.debugBorderColor
//   //   //       }`;
//   //   //
//   //   //     scrollTrackerPoint.debugLabel.appendChild(label);
//   //   //     this.debugLabelContainer.appendChild(scrollTrackerPoint.debugLabel);
//   //   //   }
//   //   //
//   //   //   scrollTrackerPoint.debugLabel.style.height = `${scrollTrackerPoint.point.height}px`;
//   //   //   scrollTrackerPoint.debugLabel.style.top = `${scrollTrackerPoint.point.position}px`;
//   //   // }
//   // }
//
//   /**
//    * @description This will remove all added components from the scroll-tracker and destruct the scroll-tracker.
//    */
//   public dispose() {
//     window.removeEventListener('resize', this.resizeEventListener);
//     this.resizeEventListener = null;
//
//     if (this.components) {
//       this.removeComponentsFromScrollTracker(this.components);
//       this.components = null;
//     }
//
//     if (this.intersectionObserver) {
//       this.intersectionObserver.disconnect();
//     }
//   }
// }
