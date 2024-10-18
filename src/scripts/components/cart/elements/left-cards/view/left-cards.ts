export class LeftCardsView {
    private readonly cartItems: NodeListOf<HTMLElement>;
    private readonly selectedCountElement: HTMLElement;

    public onFavoriteToggle: (productId: string) => void = () => {};
    public onQuantityChange: (productId: string, action: 'increase' | 'decrease') => void = () => {};
    public onRemoveItem: (productId: string) => void = () => {};
    public onSelectItem: (productId: string, isSelected: boolean) => void = () => {};

    constructor() {
        this.cartItems = document.querySelectorAll('.cart-item') as NodeListOf<HTMLElement>;
        this.selectedCountElement = document.getElementById('selected-count') as HTMLElement;

        if (this.cartItems.length > 0) {
            this.setupEventListeners();
        }
    }

    // Настройка прослушивания событий
    private setupEventListeners(): void {
        this.cartItems.forEach(item => {
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

            // Выбор товара (чекбоксы)
            const itemCheckbox = item.querySelector('.cart-item__select-item') as HTMLInputElement;
            itemCheckbox?.addEventListener('change', () => {
                if (productId) this.onSelectItem(productId, itemCheckbox.checked);
            });
        });
    }

    // Обновить счетчик выбранных товаров
    public updateSelectedCount(count: number): void {
        if (this.selectedCountElement) {
            this.selectedCountElement.textContent = count.toString();
        }
    }

    // Обновить иконку избранного
    public updateFavoriteIcon(productId: string, isLiked: boolean): void {
        const favoriteButton = document.querySelector(`#favorite-${productId} .cart-item__wishlist-icon`);

        if (favoriteButton) {
            favoriteButton.textContent = isLiked ? 'favorite' : 'favorite_border';
        }
    }

    // Обновить отображение количества товара
    public updateQuantityDisplay(productId: string, quantity: number): void {
        const quantityDisplay = document.querySelector(`#quantity-${productId}`);

        if (quantityDisplay) {
            quantityDisplay.textContent = `${quantity} шт.`;
        }
    }

    // Переключение кнопки "минус" на иконку удаления
    public switchMinusButtonToDelete(productId: string, isDelete: boolean): void {
        const minusButton = document.querySelector(`#minus-${productId}`);

        if (minusButton) {
            minusButton.innerHTML = isDelete ? '&#128465;' : '-';
            minusButton.classList.toggle('delete-btn', isDelete);
        }
    }

    // Удалить товар
    public removeItem(productId: string): void {
        const item = document.getElementById(`cart-item-${productId}`);

        if (item) {
            item.remove();
        }
    }
}