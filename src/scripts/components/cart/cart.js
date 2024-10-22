import { DataSamplingView } from '@/scripts/components/cart/elements/data-sampling/view/data-sampling.ts';
import { CartPresenter } from '@/scripts/components/cart/presenter/cart.ts';
import { cartData } from '@/scripts/components/cart/api/products.ts';
import { rootId } from "@/services/app/config.ts";
import cart from './view/cart.hbs?raw';
import leftCards from './elements/left-cards/view/left-cards.hbs?raw';
import rightElementOfCart from './elements/right-element-of-cart/view/right-element-of-cart.hbs?raw';
import dataSampling from './elements/data-sampling/view/data-sampling.hbs';


/**
 * Функция для рендеринга корзины.
 *
 * Использует функцию `templatize` для вставки шаблона в элемент body на странице.
 *
 * @function
 * @returns {boolean} Возвращает промис, который разрешается после завершения рендеринга.
 */
export async function cartBuilder() {
  const rootElement = document.getElementById(rootId);
  if (rootElement)
    return await new Promise((resolve, reject) => {
      // Вставляем тело страницы
      document.body.insertAdjacentHTML('beforeend', Handlebars.compile(cart)());

      const leftCardsRoot = document.getElementById('left-cards');
      const rightElementOfCartRoot = document.getElementById('right-element-of-cart');
      const dataSamplingRoot = document.getElementById('data-sampling');

      if (leftCardsRoot && rightElementOfCartRoot && dataSampling) {
        leftCardsRoot.innerHTML = '';
        rightElementOfCartRoot.innerHTML = '';
        dataSamplingRoot.innerHTML = '';

        leftCardsRoot.insertAdjacentHTML('beforeend', Handlebars.compile(leftCards)(cartData));
        rightElementOfCartRoot.insertAdjacentHTML('beforeend', Handlebars.compile(rightElementOfCart)(cartData));
        dataSamplingRoot.insertAdjacentHTML('beforeend', Handlebars.compile(dataSampling)(cartData));

        resolve();
      } else {
        reject(new Error(`Ошибка отрисовки cart`));
      }
    })
        .then(() => {
          const dataSamplingView = new DataSamplingView();
          const cartPresenter = new CartPresenter(dataSamplingView);

          cartPresenter.initializeCart();
        })
        .catch((err) => {
          console.log(err);
        });
}

