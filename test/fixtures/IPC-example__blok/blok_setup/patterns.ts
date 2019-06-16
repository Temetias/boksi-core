/**
 * Generic type-guard implementation for interfaces.
 */
export const isInstanceOfInterface = <T>(object: any, uniqueProperty: keyof T): object is T => uniqueProperty in object;