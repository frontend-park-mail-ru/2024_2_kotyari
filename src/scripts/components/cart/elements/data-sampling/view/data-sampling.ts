/**
 * Класс DataSamplingView управляет отображением и взаимодействием с чекбоксами товаров в корзине.
 *
 * @class DataSamplingView
 */
export class DataSamplingView {
  /**
   * HTML-элемент для чекбокса "Выбрать всё".
   * @private {HTMLInputElement}
   */
  private selectAllCheckbox: HTMLInputElement;

  /**
   * Список HTML-элементов, являющихся чекбоксами у товаров.
   * @private {NodeListOf<HTMLInputElement>}
   */
  private itemCheckboxes: NodeListOf<HTMLInputElement>;

  /**
   * HTML-элемент для отображения количества выбранных элементов.
   * @private {HTMLElement}
   */
  private selectedCountElement: HTMLElement;

  /**
   * HTML-элемент для удаления из корзины выбранных товаров.
   * @private {HTMLElement | null}
   */
  private deleteSelectedButton: HTMLElement;

  /**
   * Конструктор класса DataSamplingView.
   * Инициализирует элементы управления для выбора товаров в корзине.
   */
  constructor() {
    this.selectAllCheckbox = document.getElementById('select-all') as HTMLInputElement;
    this.itemCheckboxes = document.querySelectorAll('.cart-item__select-item') as NodeListOf<HTMLInputElement>;
    this.selectedCountElement = document.getElementById('selected-count') as HTMLElement;
    this.deleteSelectedButton = document.querySelector('.cart-header__delete-selected') as HTMLElement;
  }

  /**
   * Инициализирует состояние чекбоксов для всех товаров на основе переданных данных.
   *
   * @param {Array<{id: string, isSelected: boolean}>} products - Данные продуктов корзины.
   */
  initializeCheckboxes(products: Array<{ id: string; isSelected: boolean }>) {
    this.itemCheckboxes.forEach((checkbox) => {
      const productId = checkbox.id.split('-')[2];
      const product = products.find((p) => p.id === productId);
      if (product) {
        checkbox.checked = product.isSelected;
      }
    });
  }

  /**
   * Обновляет состояние чекбокса "select-all" в зависимости от состояния товаров.
   *
   * @param {boolean} allChecked - Булево значение, указывающее, выбраны ли все товары.
   * @param {boolean} isIndeterminate - Булево значение, указывающее на частичный выбор товаров.
   */
  updateSelectAllCheckbox(allChecked: boolean, isIndeterminate: boolean) {
    this.selectAllCheckbox.checked = allChecked;
    this.selectAllCheckbox.indeterminate = allChecked ? false : isIndeterminate; // Исправлено

    // Удаляем или добавляем класс для indeterminate
    if (isIndeterminate) {
      this.selectAllCheckbox.classList.add('cart-header__select-all--indeterminate');
    } else {
      this.selectAllCheckbox.classList.remove('cart-header__select-all--indeterminate');
    }
  }

  /**
   * Удаляет выбранные товары из DOM.
   *
   * @param {HTMLInputElement[]} selectedItems - Массив чекбоксов выбранных товаров.
   */
  removeSelectedItems(selectedItems: HTMLInputElement[]) {
    selectedItems.forEach((item) => {
      item.closest('.cart-item')?.remove();
    });
  }

  /**
   * Обновляет количество выбранных товаров в интерфейсе.
   *
   * @param {number} count - Количество выбранных товаров.
   */
  updateSelectedCount(count: number) {
    this.selectedCountElement.innerText = count.toString();
  }

  /**
   * Устанавливает слушатель на изменение состояния чекбокса "select-all".
   *
   * @param {function(boolean): void} callback - Функция-обработчик изменения состояния.
   */
  onSelectAllChange(callback: (checked: boolean) => void) {
    this.selectAllCheckbox.addEventListener('change', function (event) {
      const target = event.currentTarget as HTMLInputElement;

      // Удаляем класс 'cart-header__select-all--indeterminate'
      target.classList.remove('cart-header__select-all--indeterminate');

      callback(this.checked);
    });
  }

  /**
   * Устанавливает слушатель на изменение состояния отдельных чекбоксов товаров.
   *
   * @param {function(string, boolean): void} callback - Функция-обработчик изменения состояния товара.
   */
  onItemCheckboxChange(callback: (productId: string, checked: boolean) => void) {
    this.itemCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const productId = checkbox.id.split('-')[2];
        callback(productId, checkbox.checked);
      });
    });
  }

  /**
   * Устанавливает слушатель на удаление выбранных товаров.
   *
   * @param {function(): void} callback - Функция-обработчик удаления товаров.
   */
  onDeleteSelected(callback: () => void) {
    this.deleteSelectedButton.addEventListener('click', (e) => {
      e.preventDefault();
      callback();
    });
  }

  /**
   * Возвращает список выбранных товаров.
   *
   * @returns {HTMLInputElement[]} Массив чекбоксов выбранных товаров.
   */
  getSelectedItems(): HTMLInputElement[] {
    return Array.from(document.querySelectorAll('.cart-item__select-item:checked')) as HTMLInputElement[];
  }
}
