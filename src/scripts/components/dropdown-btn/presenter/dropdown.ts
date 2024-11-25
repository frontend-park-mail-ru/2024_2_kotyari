
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

    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdown');

    const dropdownTrigger = document.createElement('div');
    dropdownTrigger.classList.add('dropdown-trigger');

    const textSpan = document.createElement('span');
    textSpan.textContent = 'Сортировать'
    textSpan.style.fontSize = '16px';
    textSpan.style.paddingTop = '2px';
    textSpan.style.fontWeight = 600;

    dropdownTrigger.appendChild(textSpan);
    const span = document.createElement('span');
    span.classList.add('material-icons')
    span.textContent = 'unfold_more';
    dropdownTrigger.appendChild(span);

    dropdownTrigger.style.display = 'inline-flex';
    dropdownTrigger.style.alignSelf = 'center';
    dropdownTrigger.style.justifyContent = 'center';
    dropdownTrigger.style.padding = '5px 12px';

    const dropdownList = document.createElement('ul');
    dropdownList.classList.add('dropdown-list');

    this.config.sortOptions.forEach((option) => {
      const dropdownItem = document.createElement('li');
      dropdownItem.classList.add('dropdown-item');
      dropdownItem.textContent = option.text;

      dropdownItem.addEventListener('click', () => {
        this.sort = option.value;
        this.config.onSortChange(this.sort, this.order);
        dropdownList.classList.remove('show');
      });

      dropdownList.appendChild(dropdownItem);
    });

    dropdownTrigger.addEventListener('click', () => {
      dropdownList.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
      if (!dropdownContainer.contains(event.target as Node)) {
        dropdownList.classList.remove('show');
      }
    });

    dropdownContainer.appendChild(dropdownTrigger);
    dropdownContainer.appendChild(dropdownList);
    container.appendChild(dropdownContainer);
  }
}