export class RightElementOfOrderPlacementView {
  /**
   * Коллекция DOM-элементов, представляющих способы оплаты.
   *
   * @private
   * @type {NodeListOf<Element>}
   */
  private paymentMethods: NodeListOf<Element>;

  /**
   * Конструктор класса RightElementOfOrderPlacementView.
   * Инициализирует список способов оплаты и запускает процессы инициализации.
   */
  constructor() {
    // Инициализация: получаем все элементы способов оплаты
    this.paymentMethods = document.querySelectorAll('.right-element-card__payment-method');
    this.init();
  }

  /**
   * Удаляет класс, обозначающий выбранный метод оплаты, со всех элементов.
   *
   * @private
   * @returns {void}
   */
  private clearSelected(): void {
    this.paymentMethods.forEach((method) => {
      method.classList.remove('right-element-card__payment-method--selected');
    });
  }

  /**
   * Устанавливает первый способ оплаты как выбранный по умолчанию.
   *
   * @private
   * @returns {void}
   */
  private setDefaultSelected(): void {
    if (this.paymentMethods.length > 0) {
      this.paymentMethods[0].classList.add('right-element-card__payment-method--selected');
    }
  }

  /**
   * Добавляет обработчики событий для каждого способа оплаты.
   *
   * @private
   * @returns {void}
   */
  private addEventListeners(): void {
    this.paymentMethods.forEach((method) => {
      method.addEventListener('click', () => {
        this.clearSelected();
        method.classList.add('right-element-card__payment-method--selected');
      });
    });
  }

  /**
   * Инициализирует выбор способа оплаты по умолчанию и добавляет обработчики событий.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    this.setDefaultSelected();
    this.addEventListeners();
  }
}
