import { TemplateManager } from '../../../constprograms/templatizer/templatizer.js';

const defaultPath = '/src/scripts/components/card/view/card.hbs';
const defaultRootId = 'main';

export interface CardViewInterface{
  render(data: { products: any[] }): Promise<void>;
}

export class CardView implements CardViewInterface {
  private rootId: string = defaultRootId;
  private readonly tmpPath: string;

  constructor(tmpPath: string = defaultPath) {
    this.tmpPath = tmpPath;
  }

  render = (data: { products: any[] }): Promise<void> => {
    const rootElement = document.getElementById(this.rootId);
    if (!rootElement) {
      return Promise.reject(new Error(`Element ID = ${this.rootId} not found`));
    }

    return TemplateManager.templatize(rootElement, this.tmpPath, data)
      .then(() =>{
        if (!rootElement) {
          return Promise.reject(new Error(`Element ID = ${this.rootId} not found`));
        }
      })
      .catch(err => {
        console.error('[CardView.render] ', err);
      })
  };
}
