module.exports = {
    capitalize: capitalize,
    toCamelCase: toCamelCase,
    toKebabCase: toKebabCase,
    toSnakeCase: toSnakeCase
};

function capitalize(str) {
    if (str.length) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    return str;
}

function toCamelCase(str) {
    let s =
        str &&
        str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
        .join('');
    return s.slice(0, 1).toLowerCase() + s.slice(1);
};

function toKebabCase(str) {
    return str &&
        str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
}

function toSnakeCase(str) {
    return str &&
        str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('_');
}
