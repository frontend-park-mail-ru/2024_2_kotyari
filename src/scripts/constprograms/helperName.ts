import {Helper} from "./helper";
import Handlebars from "handlebars";

interface iHelper {
    name: string,
    function: (...args: any[]) => string | boolean
}

const helperName: Array<iHelper> = [
    {
        name: 'formatDate',
        function: Helper.formatDate.bind(Helper)
    }, {
        name: 'pluralize',
        function: Helper.pluralize.bind(Helper)
    }, {
        name: 'eq',
        function: Helper.eq.bind(Helper)
    }
];

export async function registerFunctions(): Promise<Boolean> {
    try {
        helperName.forEach((helpFunction: iHelper) => {
            console.log(helpFunction.name, helpFunction.function)
            Handlebars.registerHelper(helpFunction.name, helpFunction.function);
        })
    } catch (error) {
        console.error(error);

        return false;
    }

    return true;
}