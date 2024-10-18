import { CartView } from '/dist/scripts/components/cart/view/cart.js';
import { CartPresenter } from '/dist/scripts/components/cart/presenter/cart.js';
import { TemplateManager } from "/dist/scripts/constprograms/templatizer/templatize.js";
import { cartData } from "/dist/scripts/components/cart/api/products.js";

export function cart() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/cart/view/cart.hbs', cartData).then(() => {
        const cartView = new CartView();
        const cartPresenter = new CartPresenter(cartView);

        cartPresenter.initializeCart();
    });
}
