import { DataSamplingView } from '/dist/scripts/components/cart/elements/data-sampling/view/data-sampling.js';
import { CartPresenter } from '/dist/scripts/components/cart/presenter/cart.js';
import { TemplateManager } from "/dist/scripts/constprograms/templatizer/templatize.js";
import { cartData } from "/dist/scripts/components/cart/api/products.js";

export function cart() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/cart/view/cart.hbs', cartData).then(() => {
        const dataSamplingView = new DataSamplingView();
        const cartPresenter = new CartPresenter(dataSamplingView);

        cartPresenter.initializeCart();
    });
}
