/**
 * Copyright 2016
 * Created by Carlos on 3/26/2016.
 */

module.exports = {
    capitalize: capitalize
};

function capitalize(str) {
    if (str.length) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
    return str;
}
