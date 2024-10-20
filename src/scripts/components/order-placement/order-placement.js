import { TemplateManager } from "/dist/scripts/constprograms/templatizer/templatize.js";
import { RightElementOfOrderPlacementView } from "/dist/scripts/components/order-placement/elements/right-element-of-order-placement/view/right-element-of-order-placement.js";
import { orderData } from "/dist/scripts/components/order-placement/api/order-placement.js";

/**
 * Функция для рендеринга шаблона размещения заказа и инициализации правого элемента.
 *
 * @returns {Promise<void>} Возвращает промис, который разрешается после того, как шаблон будет отрендерен и элемент инициализирован.
 */
export function orderPlacement() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/order-placement/view/order-placement.hbs', orderData).then(() => {
        new RightElementOfOrderPlacementView();
    })
}
