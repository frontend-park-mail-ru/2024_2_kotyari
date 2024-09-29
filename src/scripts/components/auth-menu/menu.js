import {templatize} from "../../constprograms/shablon/shablon.js";

const tmpURL = 'src/scripts/components/auth-menu/menu.hbs'

/**
 * Builds the authentication menu by rendering a template with provided data.
 *
 * @param {Object} data - The data to populate the template.
 * @returns {Promise<void>} - A promise that resolves once the template is rendered.
 */
export async function buildAuthMenu(data){
    return templatize(document.getElementById('main'), tmpURL, data);
}
