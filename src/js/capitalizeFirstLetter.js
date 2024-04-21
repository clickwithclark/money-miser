// to always return type string event when string may be falsy other than empty-string
export const capitalizeFirstLetter = (string = '') => string && string[0].toUpperCase() + string.slice(1);
