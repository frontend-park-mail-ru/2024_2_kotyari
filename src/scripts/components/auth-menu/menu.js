import {templatize} from "../../constprograms/shablon.js";

const tmpURL = 'src/scripts/components/auth-menu/menu.hbs'

export function buildAuthMenu(data){
    return templatize(document.getElementById('auth__menu'), tmpURL, data);
}
