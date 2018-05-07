/**
 * @class ScrollUtils
 * @description Simple class used for basic scroll actions on the body
 *
 */
class ScrollUtils {
  /**
   * @public static
   * @method set scrollTop
   * @param y
   */
  public static set scrollTop(y: number) {
    this.scrollElement.scrollTop = y;
  }

  /**
   * @public static
   * @method get scrollTop
   * @returns {number}
   */
  public static get scrollTop(): number {
    return this.scrollElement.scrollTop;
  }

  /**
   * Method used to get the scrollElement for all browsers.
   *
   * @private static
   * @method get scrollElement
   * @returns {Element|HTMLElement}
   */
  private static get scrollElement(): Element {
    return document.documentElement.clientHeight ? document.documentElement : document.body;
  }
}

export default ScrollUtils;
