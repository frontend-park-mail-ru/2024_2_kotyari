import Handlebars from 'handlebars';
import searchMenu from './searcher.hbs?raw'


class Search {
  private firstRender:boolean = true;


  public render = () => {
    if (this.firstRender) {
      this.firstRender = false;

    }
  }
}