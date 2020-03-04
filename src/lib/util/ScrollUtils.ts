/**
 * @class ScrollUtils
 * @description Simple class used for basic scroll actions on the body
 *
 */
export default class ScrollUtils {
  /**
   * @public static
   * @method set scrollTop
   * @param y
   */
  public static set scrollLeft(x: number) {
    window.scrollTo(x, 0);
  }

  /**
   * @public static
   * @method set scrollTop
   * @param y
   */
  public static set scrollTop(y: number) {
    window.scrollTo(0, y);
  }

  /**
   * @public static
   * @method get scrollTop
   * @returns {number}
   */
  public static get scrollTop(): number {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  /**
   * @public static
   * @method get scrollTop
   * @returns {number}
   */
  public static get scrollLeft(): number {
    return window.pageXOffset || document.documentElement.scrollLeft;
  }
}
