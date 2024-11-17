import { DropdownAPI } from '../api/dropdown';
import { DropdownView } from '../view/dropdown';
import { DropdownConfig } from '../view/configs';

export class DropdownPresenter {
  private view: DropdownView;
  private api: DropdownAPI;
  private config: DropdownConfig;

  constructor(containerId: string, config: DropdownConfig) {
    this.config = config;

    this.view = new DropdownView(
      containerId,
      config.defaultTriggerText,
      config.options,
    );
    this.api = new DropdownAPI(config.apiEndpoint);

    this.initEventHandlers();
  }

  private initEventHandlers(): any {
    this.view.onOptionHover((value) => {
      this.api.fetchData(value)
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error('Ошибка при предзагрузке:', error);
        });
    });
  }

  public render(): void {
    this.view.render();
  }
}
