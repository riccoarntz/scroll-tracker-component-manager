import { ScrollbarPlugin } from 'smooth-scrollbar';

export class HorizontalScrollPlugin extends ScrollbarPlugin {
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
