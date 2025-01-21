/**
 *
 * Function for getting the last element of an array where it satisfies the given condition
 *
 * @param array An array that needs to be filtered
 * @param predicate
 * @returns {T | undefined}
 */
export declare function lastWhere<T>(array: T[], predicate: (item: T) => boolean): T | undefined;
