import {templatize} from "../../../constprograms/shablon/shablon.js";

const returnPage = '/';

export function soon() {
    return templatize(document.getElementById('main'), '/src/scripts/components/custom-messages/soon/soon.hbs', {
        return: returnPage
    })
}