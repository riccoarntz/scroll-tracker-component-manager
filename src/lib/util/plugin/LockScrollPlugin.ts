import { ScrollbarPlugin } from 'smooth-scrollbar';

export class LockScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'lock';
  static defaultOptions = {
    isLock: false,
  };

  transformDelta(delta: { x: number; y: number }) {
    return this.options.isLock ? { x: 0, y: 0 } : delta;
  }
}
