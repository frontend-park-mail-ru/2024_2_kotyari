export const errors = {
    BadElement: (elementType) => {
        console.error(`Element type "${elementType}" not found in config.`);
    }
}
