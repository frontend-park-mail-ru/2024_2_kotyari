export class DropdownView {
  private container: HTMLElement;
  private readonly dropdownTrigger: HTMLDivElement;
  private readonly dropdownList: HTMLUListElement;

  constructor(containerId: string, triggerText: string, options: { value: string; text: string }[]) {
    this.container = document.getElementById(containerId) || document.body;
    this.dropdownTrigger = document.createElement('div');
    this.dropdownTrigger.classList.add('dropdown-trigger');
    this.dropdownTrigger.textContent = triggerText;

    this.dropdownList = document.createElement('ul');
    this.dropdownList.classList.add('dropdown-list');

    options.forEach((option) => {
      const listItem: HTMLLIElement = document.createElement('li');
      listItem.classList.add('dropdown-item');
      listItem.textContent = option.text;
      listItem.dataset.value = option.value;

      this.dropdownList.appendChild(listItem);
    });

    this.initEventHandlers();
  }

  private initEventHandlers(): void {
    this.dropdownTrigger.addEventListener('click', () => {
      this.dropdownList.classList.toggle('show');
    });

    document.addEventListener('click', (event: MouseEvent) => {
      if (!this.container.contains(event.target as Node)) {
        this.dropdownList.classList.remove('show');
      }
    });
  }

  public onOptionHover(callback: (value: string) => void): void {
    Array.from(this.dropdownList.children).forEach((listItem) => {
      listItem.addEventListener('mouseover', () => {
        const value = (listItem as HTMLLIElement).dataset.value || '';
        callback(value);
      });
    });
  }

  public onOptionClick(callback: (value: string) => void): void {
    Array.from(this.dropdownList.children).forEach((listItem) => {
      listItem.addEventListener('click', () => {
        const value = (listItem as HTMLLIElement).dataset.value || '';
        callback(value);
      });
    });
  }

  public render(): void {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.classList.add('dropdown');

    dropdownContainer.appendChild(this.dropdownTrigger);
    dropdownContainer.appendChild(this.dropdownList);

    this.container.appendChild(dropdownContainer);
  }
}
