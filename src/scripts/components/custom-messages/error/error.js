import {errorsDescriptions} from "./errors.js";
import {templatize} from "../../../constprograms/shablon/shablon.js";

const returnPage = '/';

export function errorPage (name) {
    let config = {
        name: '404',
        description: errorsDescriptions['404'],
        return: returnPage
    }

    if (name in errorsDescriptions) {
        config = {
            name: name,
            description: errorsDescriptions[name],
            return: returnPage
        }
    }

    return templatize(document.getElementById('main'), '/src/scripts/components/custom-messages/error/error.hbs', config)
}