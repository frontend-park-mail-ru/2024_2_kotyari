export class DataSamplingView {
  private selectAllCheckbox: HTMLInputElement;
  private itemCheckboxes: NodeListOf<HTMLInputElement>;
  private selectedCountElement: HTMLElement;
  private deleteSelectedButton: HTMLElement;

  constructor() {
    this.selectAllCheckbox = document.getElementById('select-all') as HTMLInputElement;
    this.itemCheckboxes = document.querySelectorAll('.cart-item__select-item') as NodeListOf<HTMLInputElement>;
    this.selectedCountElement = document.getElementById('selected-count') as HTMLElement;
    this.deleteSelectedButton = document.querySelector('.cart-header__delete-selected') as HTMLElement;
  }

  /**
   * Инициализирует состояние чекбоксов для всех товаров на основе переданных данных.
   *
   * @param products Данные продуктов корзины
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
   * Обновляет состояние чекбокса "select-all" в зависимости от выбора всех товаров.
   *
   * @param allChecked Булево значение: выбраны ли все товары.
   * @param isIndeterminate
   */
  updateSelectAllCheckbox(allChecked: boolean, isIndeterminate: boolean) {
    this.selectAllCheckbox.checked = allChecked;
    this.selectAllCheckbox.indeterminate = isIndeterminate;

    // Добавляем или убираем класс для состояния indeterminate
    if (isIndeterminate) {
      this.selectAllCheckbox.classList.add('cart-header__select-all--indeterminate');
    } else {
      this.selectAllCheckbox.classList.remove('cart-header__select-all--indeterminate');
    }
  }

  /**
   * Удаляет элементы товаров из DOM.
   *
   * @param selectedItems Массив чекбоксов выбранных товаров.
   */
  removeSelectedItems(selectedItems: HTMLInputElement[]) {
    selectedItems.forEach((item) => {
      item.closest('.cart-item')?.remove();
    });
  }

  /**
   * Обновляет количество выбранных товаров.
   *
   * @param count Количество выбранных товаров.
   */
  updateSelectedCount(count: number) {
    this.selectedCountElement.innerText = count.toString();
  }

  // Слушатель на изменение состояния чекбокса "select-all"
  onSelectAllChange(callback: (checked: boolean) => void) {
    this.selectAllCheckbox.addEventListener('change', function () {
      callback(this.checked);
    });
  }

  // Слушатель на изменение отдельных чекбоксов товаров
  onItemCheckboxChange(callback: (productId: string, checked: boolean) => void) {
    this.itemCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const productId = checkbox.id.split('-')[2];
        callback(productId, checkbox.checked);
      });
    });
  }

  // Слушатель на удаление выбранных товаров
  onDeleteSelected(callback: () => void) {
    this.deleteSelectedButton.addEventListener('click', (e) => {
      e.preventDefault();
      callback();
    });
  }

  // Метод для получения всех выбранных товаров
  getSelectedItems(): HTMLInputElement[] {
    return Array.from(document.querySelectorAll('.cart-item__select-item:checked')) as HTMLInputElement[];
  }
}
