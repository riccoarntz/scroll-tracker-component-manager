import CoreComponent from 'muban-core/lib/CoreComponent';

export default abstract class AbstractScrollComponent extends CoreComponent {
  public componentId: string;
  public enterViewThreshold: number = 0.25;
  public inViewProgressThreshold: number = 0;
  public currentViewProgress: number = 0;
  public hasEntered: boolean = false;

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
    console.log('inViewProgress', this.componentId, progress);
  }

  /**
   * @public
   * @method enterView
   */
  public enterView(): void {
    // console.log(this.currentViewProgress);
    console.log('enterView', this.componentId);
  }

  /**
   * @public
   * @method\
   */
  public leaveView(): void {
    console.log('leaveView', this.componentId);
  }

  /**
   * @public
   * @method beyondView
   */
  public beyondView(): void {
    console.log('beyondView', this.componentId);
  }

  public get displayName() {
    return this.element.getAttribute(`data-component`);
  }
}
