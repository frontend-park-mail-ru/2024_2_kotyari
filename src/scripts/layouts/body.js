import {templatize} from '../constprograms/shablon.js'

export function buildBody(data) {
    return templatize(document.body, '/src/scripts/layouts/body.hbs', data);
}
