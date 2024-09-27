import {templatize} from "../../constprograms/shablon/shablon.js";
import {menuSignUp} from "./menu-config.js";
import {handleSignUp} from "../../../services/client/auth/auth.js";

const tmpURL = 'src/scripts/components/auth-menu/menu.hbs'

export async function buildAuthMenu(data){
    return templatize(document.getElementById('auth__menu'), tmpURL, data);
}
