import { HelperFunctions } from './types/types'

// Массив хелперов с явными типами
export const helpers: Array<{
    name: keyof HelperFunctions;
    function: HelperFunctions[keyof HelperFunctions];
}>;
