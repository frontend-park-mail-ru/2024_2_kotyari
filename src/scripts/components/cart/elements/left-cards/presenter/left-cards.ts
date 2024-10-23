import { RightCartPresenter } from '../../right-element-of-cart/presenter/calculate-cart-totals.js';
import { cartData } from '../../../api/products.js';
import { CartProduct } from '../../../types/types';
import { LeftCardsView } from '../view/left-cards.js';
import { RightCartView } from '../../right-element-of-cart/view/calculate-cart-totals.js';

export class LeftCardsPresenter {
  private view: LeftCardsView;
  private rightCartPresenter: RightCartPresenter;

  constructor(view: LeftCardsView) {
    this.view = view;

    const rightCartView = new RightCartView();
    this.rightCartPresenter = new RightCartPresenter(rightCartView);

    this.view.onFavoriteToggle = this.handleFavoriteToggle.bind(this);
    this.view.onQuantityChange = this.handleQuantityChange.bind(this);
    this.view.onRemoveItem = this.handleRemoveItem.bind(this);
    this.view.onSelectItem = this.handleSelectItem.bind(this);
  }

  // Метод для обновления количества выбранных товаров
  updateSelectedCount(): void {
    const selectedCount = cartData.products.filter((product: CartProduct) => product.isSelected).length;
    this.view.updateSelectedCount(selectedCount);
    this.rightCartPresenter.calculateCartTotals();

    // Пересчет состояния чекбокса "Выбрать все"
    this.updateSelectAllCheckbox();
  }

  // Метод для обновления состояния чекбокса "Выбрать все"
  updateSelectAllCheckbox(): void {
    const selectedCount = cartData.products.filter((product: CartProduct) => product.isSelected).length;
    const allChecked = selectedCount === cartData.products.length;
    const isIndeterminate = selectedCount > 0 && selectedCount < cartData.products.length;

    this.view.updateSelectAllCheckbox(allChecked, isIndeterminate);
  }

  // Обработчик для переключения состояния "избранное"
  private handleFavoriteToggle(productId: string): void {
    const product = this.findProductById(productId);
    if (product) {
      product.is_liked = !product.is_liked;
      this.view.updateFavoriteIcon(productId, product.is_liked);
    }
  }

  // Обработчик изменения количества товара
  private handleQuantityChange(productId: string, action: 'increase' | 'decrease'): void {
    const product = this.findProductById(productId);

    if (product) {
      if (action === 'increase') {
        product.quantity++;
      } else if (action === 'decrease' && product.quantity > 1) {
        product.quantity--;
      }

      this.view.updateQuantityDisplay(productId, product.quantity);

      // Переключение кнопки в режим удаления при количестве = 1
      const isSingleItem = product.quantity === 1;
      this.view.switchMinusButtonToDelete(productId, isSingleItem);

      product.isSingleItem = isSingleItem;
      this.rightCartPresenter.calculateCartTotals();
    }
  }

  // Обработчик удаления товара
  private handleRemoveItem(productId: string): void {
    cartData.products = cartData.products.filter((product) => product.id !== productId);
    this.view.removeItem(productId);
    this.updateSelectedCount(); // Пересчёт выбранных товаров
    this.updateSelectAllCheckbox(); // Обновляем состояние select-all
  }

  // Обработчик выбора товара
  private handleSelectItem(productId: string, isSelected: boolean): void {
    const product = this.findProductById(productId);
    if (product) {
      product.isSelected = isSelected;
      this.updateSelectedCount();
    }
  }

  // Вспомогательный метод для поиска товара по id
  private findProductById(productId: string): CartProduct | undefined {
    return cartData.products.find((p: CartProduct) => p.id === productId);
  }
}
