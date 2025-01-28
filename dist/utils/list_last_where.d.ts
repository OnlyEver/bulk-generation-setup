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
export declare function findLastBreadthRequest(array: any[]): any | undefined;
/**
 * Finds the last matching request in the array for a specific condition and the highest `n` value.
 *
 * @param array - The array of request objects.
 * @param type - The type to match (e.g., "depth").
 * @param bloomLevel - The bloom level to match.
 * @returns The last matching request object or undefined if none is found.
 */
export declare function findLastDepthRequest(array: any[], type: string, bloomLevel: number): any | undefined;
