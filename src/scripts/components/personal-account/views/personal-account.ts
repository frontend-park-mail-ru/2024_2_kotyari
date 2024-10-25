import { rootId } from '../../../../services/app/config';
import Handlebars from 'handlebars';
import account from './personal-account.hbs?raw';

export class PersonalAccountPage {
  private compiled = Handlebars.compile(account);

  constructor(private data: any) {}

  public async render() {
    const rootElement = document.getElementById(rootId) as HTMLElement;
    if (!rootElement) {
      console.error(`Element with id ${rootId} not found`);
      return;
    }

    this.initializeUI(rootElement);
  }

  private initializeUI(rootElement: HTMLElement) {
    rootElement.innerHTML = '';
    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiled(this.data);
    rootElement.appendChild(templateElement);
  }
}
