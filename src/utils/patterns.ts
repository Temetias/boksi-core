/**
 * A safety-wrapped to use with async-await -syntax for cleaner and more consistent error-handling.
 *
 * TODO: Improve so that the error and value don't have to be cast un-null with "!".
 */
export const safely = async <T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> => {
	try {
		return [null, await promise];
	} catch (error) {
		return [error, null];
	}
};

/**
 * Generic type-guard implementation for interfaces.
 */
export const isInstanceOfInterface = <T>(object: any, uniqueProperty: keyof T): object is T => uniqueProperty in object;
