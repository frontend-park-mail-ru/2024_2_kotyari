/**
 * Класс LeftCardsView отвечает за отображение и управление карточками товаров
 * в пользовательском интерфейсе корзины слева.
 *
 * @class LeftCardsView
 */
export class LeftCardsView {
  /**
   * Коллекция элементов карточек товаров.
   *
   * @private
   * @type {NodeListOf<HTMLElement>}
   */
  private readonly cartItems: NodeListOf<HTMLElement>;

  /**
   * DOM-элемент, отображающий количество выбранных товаров.
   *
   * @private
   * @type {HTMLElement}
   */
  private readonly selectedCountElement: HTMLElement;

  /**
   * Чекбокс для выбора всех товаров в корзине.
   *
   * @private
   * @type {HTMLInputElement}
   */
  private readonly selectAllCheckbox: HTMLInputElement;

  public onFavoriteToggle: (productId: string) => void = () => {};
  public onQuantityChange: (productId: string, action: 'increase' | 'decrease') => void = () => {};
  public onRemoveItem: (productId: string) => void = () => {};
  public onSelectItem: (productId: string, isSelected: boolean) => void = () => {};

  /**
   * Конструктор класса LeftCardsView.
   * Инициализирует элементы карточек товаров и добавляет слушатели событий.
   */
  constructor() {
    this.cartItems = document.querySelectorAll('.cart-item') as NodeListOf<HTMLElement>;
    this.selectedCountElement = document.getElementById('selected-count') as HTMLElement;
    this.selectAllCheckbox = document.querySelector('#select-all') as HTMLInputElement;

    if (this.cartItems.length > 0) {
      this.setupEventListeners();
    }
  }

  /**
   * Настройка слушателей событий для всех элементов карточек товаров.
   * Включает управление избранными, количеством, удалением и выбором товаров.
   *
   * @private
   * @returns {void}
   */
  private setupEventListeners(): void {
    this.cartItems.forEach((item) => {
      const productId = item.querySelector('.cart-item__btn-favorite')?.id.split('-')[2];

      // Лайк/избранное
      const favoriteButton = item.querySelector('.cart-item__btn-favorite');
      favoriteButton?.addEventListener('click', () => {
        if (productId) this.onFavoriteToggle(productId);
      });

      // Увеличение и уменьшение количества товаров
      const minusButton = item.querySelector('.cart-item__quantity-btn--minus');
      const plusButton = item.querySelector('.cart-item__quantity-btn--plus');
      minusButton?.addEventListener('click', () => {
        if (productId) this.onQuantityChange(productId, 'decrease');
      });
      plusButton?.addEventListener('click', () => {
        if (productId) this.onQuantityChange(productId, 'increase');
      });

      // Удаление товара
      const removeItemButton = item.querySelector('.cart-item__remove-item');
      removeItemButton?.addEventListener('click', () => {
        if (productId) this.onRemoveItem(productId);
      });

      // Удаление товара
      const deleteBtn = item.querySelector('.delete-btn');
      deleteBtn?.addEventListener('click', () => {
        if (productId) this.onRemoveItem(productId);
      });

      // Выбор товара (чекбоксы)
      const itemCheckbox = item.querySelector('.cart-item__select-item') as HTMLInputElement;
      itemCheckbox?.addEventListener('change', () => {
        if (productId) this.onSelectItem(productId, itemCheckbox.checked);
      });
    });
  }

  /**
   * Обновляет отображение количества выбранных товаров.
   *
   * @param {number} count - Количество выбранных товаров.
   */
  public updateSelectedCount(count: number): void {
    if (this.selectedCountElement) {
      this.selectedCountElement.textContent = count.toString();
    }
  }

  /**
   * Обновляет состояние чекбокса "Выбрать все".
   *
   * @param {boolean} allChecked - Выбраны ли все товары.
   * @param {boolean} isIndeterminate - Промежуточное состояние чекбокса.
   */
  public updateSelectAllCheckbox(allChecked: boolean, isIndeterminate: boolean): void {
    this.selectAllCheckbox.checked = allChecked;
    this.selectAllCheckbox.indeterminate = isIndeterminate;
  }

  /**
   * Обновляет иконку избранного товара.
   *
   * @param {string} productId - ID товара.
   * @param {boolean} isLiked - Булево значение, указывающее, добавлен ли товар в избранное.
   */
  public updateFavoriteIcon(productId: string, isLiked: boolean): void {
    const favoriteButton = document.querySelector(`#btn-favorite-${productId} .cart-item__wishlist-icon`);

    if (favoriteButton) {
      favoriteButton.textContent = isLiked ? 'favorite' : 'favorite_border';
    }
  }

  /**
   * Обновляет отображение количества товара на карточке.
   *
   * @param {string} productId - ID товара.
   * @param {number} quantity - Количество товара.
   */
  public updateQuantityDisplay(productId: string, quantity: number): void {
    const quantityDisplay = document.querySelector(`#quantity-${productId}`);

    if (quantityDisplay) {
      quantityDisplay.textContent = `${quantity} шт.`;
    }
  }

  /**
   * Переключает кнопку "минус" на иконку удаления при количестве товара = 1.
   *
   * @param {string} productId - ID товара.
   * @param {boolean} isDelete - Булево значение, указывающее, переключить ли кнопку на режим удаления.
   */
  public switchMinusButtonToDelete(productId: string, isDelete: boolean): void {
    const minusButton = document.querySelector(`#cart-remove-${productId}`);

    if (minusButton) {
      minusButton.innerHTML = isDelete ? '&#128465;' : '-';
      minusButton.classList.toggle('delete-btn', isDelete);

      const handleRemoveClick = () => {
        if (productId) this.onRemoveItem(productId);
      };

      const handleDecreaseClick = () => {
        if (productId) this.onQuantityChange(productId, 'decrease');
      };

      // Удаляем все предыдущие обработчики, чтобы избежать утечек
      minusButton.replaceWith(minusButton.cloneNode(true));
      const updatedButton = document.querySelector(`#cart-remove-${productId}`);

      if (isDelete) {
        updatedButton?.addEventListener('click', handleRemoveClick);
      } else {
        updatedButton?.addEventListener('click', handleDecreaseClick);
      }
    }
  }

  /**
   * Удаляет элемент товара из DOM по его ID.
   *
   * @param {string} productId - ID товара.
   */
  public removeItem(productId: string): void {
    const item = document.getElementById(`cart-item-${productId}`);

    if (item) {
      item.remove();
    }
  }

  /**
   * Отображает сообщение о том, что корзина пуста.
   */
  public displayEmptyCartMessage(): void {
    const cartContainer = document.querySelector('.cart-container__content');
    if (cartContainer) {
      cartContainer.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста</p>';
    }
  }
}
