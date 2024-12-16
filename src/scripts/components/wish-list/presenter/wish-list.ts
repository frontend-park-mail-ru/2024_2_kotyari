import wishlistListTemplate from './all-wish-list.hbs?raw';
import wishlistTemplate from './wish-list.hbs?raw';
import { router } from '../../../../services/app/init';
import { WishlistApi } from '../api/wish-list';
import { backurl, rootId } from '../../../../services/app/config';
import Handlebars from 'handlebars';

export class WishlistPresenter {
  private readonly compiledList: any;
  private readonly compiledWishlist: any;

  constructor() {
    this.compiledWishlist = Handlebars.compile(wishlistTemplate);
    this.compiledList = Handlebars.compile(wishlistListTemplate);
  }

  async renderWishlist(id: string): Promise<void> {
    const container = document.getElementById('app');

    try {
      const wishlist = await WishlistApi.getWishlist(id);

      wishlist.items.forEach(item => {
        item.image_url = `${backurl}/${item.image_url}`;
      });

      console.log('123',wishlist);

      container!.innerHTML = this.compiledWishlist(wishlist);
      this.addEventListeners(id);
    } catch (error) {
      console.error('Ошибка при загрузке вишлиста:', error);
      this.showNotification('Не удалось загрузить вишлист.', 'error');
    }
  }

  private addEventListeners(id: string) {
    const titleElement = document.getElementById('wishlist-title') as HTMLElement;

    document.getElementById('back-btn')?.addEventListener('click', () => {
      router.navigate('/wishlists'); // Перенаправляем пользователя на список вишлистов
    });

    document.getElementById('rename-btn')?.addEventListener('click', () => {
      this.enableInlineEditing(titleElement, id);
    });

    document.getElementById('share-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      this.showNotification('Ссылка скопирована!', 'success');
    });

    const deleteWishlistModal = document.getElementById('delete-wishlist-modal') as HTMLElement;
    const confirmDeleteWishlistBtn = document.getElementById('confirm-delete-wishlist-btn') as HTMLButtonElement;
    const cancelDeleteWishlistBtn = document.getElementById('cancel-delete-wishlist-btn') as HTMLButtonElement;

    document.getElementById('delete-btn')?.addEventListener('click', () => {
      this.showModal(deleteWishlistModal);
    });

    confirmDeleteWishlistBtn.addEventListener('click', async () => {
      try {
        await WishlistApi.deleteWishlist(id);
        this.showNotification('Вишлист успешно удалён!', 'success');
        router.navigate('/wishlists');
      } catch (error) {
        console.error('Ошибка при удалении вишлиста:', error);
        this.showNotification('Не удалось удалить вишлист.', 'error');
      } finally {
        this.hideModal(deleteWishlistModal);
      }
    });

    cancelDeleteWishlistBtn.addEventListener('click', () => {
      this.hideModal(deleteWishlistModal);
    });

    const modal = document.getElementById('delete-confirmation-modal') as HTMLElement;
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn') as HTMLButtonElement;
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn') as HTMLButtonElement;

    let itemNameToDelete: string | null = null;

    document.querySelectorAll('.delete-item-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const itemName = (event.currentTarget as HTMLElement).getAttribute('data-item-name');
        if (itemName) {
          itemNameToDelete = itemName;
          this.showModal(modal);
        }
      });
    });

    confirmDeleteBtn.addEventListener('click', async () => {
      if (itemNameToDelete) {
        try {
          const link = router.getRouteParams()
          const l = link!["link"]

          await WishlistApi.removeFromWishlist(Number(itemNameToDelete), [l]);
          this.showNotification(`Товар "${itemNameToDelete}" успешно удалён!`, 'success');
          this.renderWishlist(id);
        } catch (error) {
          console.error('Ошибка при удалении товара:', error);
          this.showNotification('Не удалось удалить товар.', 'error');
        } finally {
          this.hideModal(modal);
          itemNameToDelete = null;
        }
      }
    });

    cancelDeleteBtn.addEventListener('click', () => {
      this.hideModal(modal);
      itemNameToDelete = null;
    });
  }

  private showModal(modal: HTMLElement) {
    modal.classList.add('visible');
    const outsideClickListener = (event: MouseEvent) => {
      if (event.target === modal) {
        this.hideModal(modal);
        modal.removeEventListener('click', outsideClickListener);
      }
    };
    modal.addEventListener('click', outsideClickListener);
  }

  private hideModal(modal: HTMLElement) {
    modal.classList.remove('visible');
  }

  private enableInlineEditing(element: HTMLElement, id: string): void {
    const currentTitle = element.innerText;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentTitle;
    input.className = 'wishlist-title-editor';

    const saveChanges = async () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== currentTitle) {
        try {
          await WishlistApi.renameWishlist(id, newTitle);
          element.innerText = newTitle;
          this.showNotification('Название успешно изменено!', 'success');
        } catch (error) {
          console.error('Ошибка при сохранении:', error);
          this.showNotification('Не удалось сохранить изменения.', 'error');
          element.innerText = currentTitle;
        }
      } else {
        element.innerText = currentTitle;
      }
      element.style.display = '';
      input.remove();
    };

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        input.blur();
      }
    });

    input.addEventListener('blur', saveChanges);

    element.innerHTML = '';
    element.style.display = 'block';
    element.appendChild(input);

    input.focus();
  }

  async renderWishlistList(): Promise<void> {
    const container = document.getElementById(rootId);

    try {
      const wishlists = await WishlistApi.getWishlists();
      container!.innerHTML = this.compiledList({ wishlists });

      document.querySelectorAll('.wishlist-link').forEach((link) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const url = (event.currentTarget as HTMLAnchorElement).getAttribute('href');
          router.navigate(url!);
        });
      });

      document.querySelectorAll('.wishlist-title').forEach((title) => {
        title.addEventListener('click', async () => {
          const element = title as HTMLElement;
          const link = element.closest('.wishlist-link')?.getAttribute('href')?.split('/').pop();
          if (link) {
            this.enableInlineEditing(element, link);
          }
        });
      });

      const createButton = document.getElementById('create-wishlist-btn') as HTMLButtonElement;
      const nameInput = document.getElementById('wishlist-name-input') as HTMLInputElement;

      createButton.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        if (!name) {
          this.showNotification('Введите название для нового вишлиста.', 'warning');
          return;
        }

        try {
          await WishlistApi.createWishlist(name);
          this.showNotification(`Вишлист "${name}" создан!`, 'success');
          await this.renderWishlistList();
        } catch (error) {
          console.error('Ошибка при создании вишлиста:', error);
          this.showNotification('Не удалось создать вишлист.', 'error');
        }
      });

      document.querySelectorAll('.wishlist-container__delete-btn').forEach((button) => {
        button.addEventListener('click', async (event) => {
          const link = (event.currentTarget as HTMLElement).getAttribute('data-id');
          if (link) {
            try {
              await WishlistApi.deleteWishlist(link);
              this.showNotification('Вишлист успешно удалён!', 'success');
              await this.renderWishlistList();  // Перерисовываем список вишлистов
            } catch (error) {
              console.error('Ошибка при удалении вишлиста:', error);
              this.showNotification('Не удалось удалить вишлист.', 'error');
            }
          }
        });
      });
    } catch (error) {
      console.error('Ошибка при загрузке списка вишлистов:', error);
      console.log(error);
      this.showNotification('Не удалось загрузить список вишлистов.', 'error');
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'warning') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
