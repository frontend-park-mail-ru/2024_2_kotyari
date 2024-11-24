
export interface DropdownConfig {
  containerId: string; // ID контейнера для отрисовки
  sortOptions: { value: string; text: string }[]; // Опции сортировки
  apiEndpoint: string; // URL для сортировки
  defaultSort: string; // Значение по умолчанию для сортировки
  defaultOrder: string; // Значение по умолчанию для порядка сортировки
  onSortChange: (sort: string, order: string) => void; // Callback для изменения сортировки
}

export class DropdownPresenter {
  private config: DropdownConfig;
  private sort: string;
  private readonly order: string;

  constructor(config: DropdownConfig) {
    this.config = config;
    this.sort = config.defaultSort;
    this.order = config.defaultOrder;
  }

  initView(): void {
    const container = document.getElementById(this.config.containerId);

    console.log('init view');

    if (!container) {
      console.error(`Контейнер с ID ${this.config.containerId} не найден`);
      return;
    }

    // Создаем dropdown-контейнер
    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdown');

    // Создаем кнопку переключателя
    const dropdownTrigger = document.createElement('div');
    dropdownTrigger.classList.add('dropdown-trigger');
    dropdownTrigger.textContent = 'Сортировать';

    // Список опций
    const dropdownList = document.createElement('ul');
    dropdownList.classList.add('dropdown-list');

    // Заполняем опции сортировки
    this.config.sortOptions.forEach((option) => {
      const dropdownItem = document.createElement('li');
      dropdownItem.classList.add('dropdown-item');
      dropdownItem.textContent = option.text;

      dropdownItem.addEventListener('click', () => {
        this.sort = option.value; // Обновляем сортировку
        this.config.onSortChange(this.sort, this.order); // Вызываем callback
        dropdownList.classList.remove('show'); // Закрываем меню после выбора
      });

      dropdownList.appendChild(dropdownItem);
    });

    // Добавляем функциональность открытия/закрытия меню
    dropdownTrigger.addEventListener('click', () => {
      dropdownList.classList.toggle('show'); // Переключаем видимость меню
    });

    // Закрываем меню при клике вне
    document.addEventListener('click', (event) => {
      if (!dropdownContainer.contains(event.target as Node)) {
        dropdownList.classList.remove('show');
      }
    });

    // Добавляем в контейнер
    dropdownContainer.appendChild(dropdownTrigger);
    dropdownContainer.appendChild(dropdownList);
    container.appendChild(dropdownContainer);
  }
}