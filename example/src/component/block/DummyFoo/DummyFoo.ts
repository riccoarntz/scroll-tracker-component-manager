import AbstractScrollComponent from '../../AbstractScrollComponent';

export default class DummyFoo extends AbstractScrollComponent {
  static displayName: string = 'dummy-foo';
  private progressElement:HTMLElement = this.getElement('.js-progress');

  constructor(public element: HTMLElement) {
    super(element);
  }

  /**
   * @public
   * @method inViewProgress
   */
  public inViewProgress(progress: number):void
  {
    if(this.progressElement) {
      this.progressElement.style.width = `${progress * 100}%`;
      // this.progressElement.innerHTML = `${progress * 100}%`;
    }
  }

  public dispose() {
    super.dispose();
  }
}
