
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
export function lastWhere<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}
