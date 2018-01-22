module.exports = {
    capitalize: capitalize
};

function capitalize(str) {
    if (str.length) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    return str;
}
