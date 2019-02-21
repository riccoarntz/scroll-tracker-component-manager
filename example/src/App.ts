import getComponentForElement from 'muban-core/lib/utils/getComponentForElement';
import ScrollTrackerComponentManager from '../../src/lib/ScrollTrackerComponentManager';
import CoreComponent from 'muban-core/lib/CoreComponent';

export default class App extends CoreComponent {
  static displayName: string = 'app-root';

  public scrollTrackerComponentManager: ScrollTrackerComponentManager<any> = new ScrollTrackerComponentManager<any>({
    // container: document.body,
    setDebugLabel: true,
    debugBorderColor: 'red',
    resizeDebounce: 100,
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
