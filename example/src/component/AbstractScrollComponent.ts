import CoreComponent from 'muban-core/lib/CoreComponent';
import { Direction } from '../../../src/lib/enum/Direction';

export default abstract class AbstractScrollComponent extends CoreComponent {
  public componentId: string;
  public enterViewThreshold: number = 0;
  public inViewProgressThreshold: number = 0;
  public currentViewProgress: number = 0;
  public hasEntered: boolean = false;
  public scrollDirection:Direction = Direction.FORWARD;

  /**
   * @description Namespace counter base
   */
  static eventNamespaceCount: number = 10000000;
  public eventNamespace: string = '';

  constructor(element: HTMLElement) {
    super(element);

    this.eventNamespace = '.' + ++AbstractScrollComponent.eventNamespaceCount;
    this.componentId = this.displayName + this.eventNamespace;
  }

  /**
   * @public
   * @method inViewProgress
   */
  public inViewProgress(progress: number): void {
    console.log('inViewProgress', this.componentId, progress, this.scrollDirection);

  }

  /**
   * @public
   * @method enterView
   */
  public enterView(): void {
    // console.log(this.currentViewProgress);
    console.log('enterView', this.componentId, this.scrollDirection);
  }

  /**
   * @public
   * @method\
   */
  public leaveView(): void {
    console.log('leaveView', this.componentId, this.scrollDirection);
  }

  /**
   * @public
   * @method beyondView
   */
  public beyondView(): void {
    console.log('beyondView', this.componentId, this.scrollDirection);
  }

  public get displayName() {
    return this.element.getAttribute(`data-component`);
  }
}
