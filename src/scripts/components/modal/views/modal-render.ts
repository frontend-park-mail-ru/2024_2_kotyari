import Handlebars from 'handlebars';
import modalTemplate from './modal.hbs?raw';

export class ModalRenderer {
  private static compiledTemplate = Handlebars.compile(modalTemplate);

  public static render(rootId: string, data: any): HTMLElement | null {
    const root = document.getElementById(rootId) as HTMLElement | null;
    if (!root) {
      console.error(`Root element with id ${rootId} not found.`);
      return null;
    }

    const templateElement = document.createElement('div');
    templateElement.innerHTML = this.compiledTemplate(data);
    root.innerHTML = '';
    root.appendChild(templateElement);

    return templateElement;
  }
}
