import { CardApiInterface } from '../api/card.js';
import { CardViewInterface } from '../view/card.js';
import { router } from '../../../../services/app/init.js';
import { backurl } from '../../../../services/app/config';

export class CardPresenter {
  private api: CardApiInterface;
  private view: CardViewInterface;

  constructor(api: CardApiInterface, view: CardViewInterface) {
    this.api = api;
    this.view = view;
  }

  init = () => {
    this.loadCards().then(() => {
      this.attachCardClickHandlers();
    });
  };

  private loadCards = async () => {
    return this.api
      .fetchCards()
      .then((cardsData) => {

        cardsData.forEach((card) => {
          card.image_url = `${backurl}/${card.image_url}`;
        });

        this.view.render({ products: cardsData });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  private attachCardClickHandlers() {
    document.querySelectorAll('.catalog__card').forEach((card) => {
      card.addEventListener('click', () => {
        const link = card.getAttribute('data-link');
        if (link) {
          router.navigate(link);
        }
      });
    });
  }
}
