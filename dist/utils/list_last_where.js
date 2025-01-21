"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastWhere = lastWhere;
/**
 *
 * Function for getting the last element of an array where it satisfies the given condition
 *
 * @param array An array that needs to be filtered
 * @param predicate
 * @returns {T | undefined}
 */
function lastWhere(array, predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) {
            return array[i];
        }
    }
    return undefined;
}
//# sourceMappingURL=list_last_where.js.map