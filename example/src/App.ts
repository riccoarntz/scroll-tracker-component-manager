import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';
import ScrollTrackerComponentManager from '../../src/lib/ScrollTrackerComponentManager';
import CoreComponent from 'muban-core/lib/CoreComponent';
import { Axis } from 'seng-scroll-tracker';

export default class App extends CoreComponent {
  static displayName: string = 'app-root';

  public scrollTrackerComponentManager: ScrollTrackerComponentManager<any> = new ScrollTrackerComponentManager<any>({
    setDebugLabel: true,
    debugBorderColor: 'red',
    inViewProgressEnabled: true,

    scrollThrottle: 100,
    resizeDebounce: 100,
    axis: Axis.X,
    enableSmoothScroll: true,
    smoothScrollOptions: {
      damping: 0.1,
      alwaysShowTracks: false,
    },
  });

  constructor(element: HTMLElement) {
    super(element);

    this.getElements(`[data-scroll-component]`).forEach(
      (element: HTMLElement) => {
        this.scrollTrackerComponentManager.addComponentToScrollTracker(<any>getComponentForElement(element));
      },
    );
  }

  public dispose() {
    // clean up stuff when hot reloading
    if (this.scrollTrackerComponentManager) {
      this.scrollTrackerComponentManager.dispose();
      this.scrollTrackerComponentManager = null;
    }
  }
}
