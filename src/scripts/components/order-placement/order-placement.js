import { TemplateManager } from "/dist/scripts/constprograms/templatizer/templatize.js";
import { rightElementOfOrderPlacement } from "./elements/right-element-of-order-placement/view/right-element-of-order-placement.js";
import { orderData } from "/dist/scripts/components/order-placement/api/order-placement.js";


export function orderPlacement() {
    return TemplateManager.templatize(document.getElementById('main'), '/src/scripts/components/order-placement/view/order-placement.hbs', orderData).then(() => {
        rightElementOfOrderPlacement()
    })
}
