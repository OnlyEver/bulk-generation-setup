"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lastWhere = lastWhere;
/**
 * Function for getting the last element of an array that satisfies the given condition.
 * This function iterates through the array in reverse order to find the last matching element.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to search through.
 * @param predicate - A callback function that takes an element of the array and returns a boolean.
 *                    The function determines whether the current element satisfies the condition.
 * @returns {T | undefined} - The last element in the array that satisfies the condition, or undefined
 *                            if no element matches.
 *
 * @example
 * const numbers = [1, 2, 3, 4, 5];
 * const lastEven = lastWhere(numbers, (num) => num % 2 === 0);
 * console.log(lastEven); // Output: 4
 *
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