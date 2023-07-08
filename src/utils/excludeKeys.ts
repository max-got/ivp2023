/**
 * Exclude keys from an object or array of objects
 * @param result Object or array of objects
 * @param keys Keys to exclude
 * @returns Object or array of objects without the excluded keys
 * @example
 * // Exclude taxid from hotel
 * const hotels = await prisma.hotel.findMany();
 * // => [{id: 1, name: 'Hotel 1', taxId: 1}, {id: 2, name: 'Hotel 2', taxId: 2}]
 * exclude(hotels, ['taxId']);
 * // => [{id: 1, name: 'Hotel 1'}, {id: 2, name: 'Hotel 2'}]
 *
 **/
function excludeKeys<Result, Key extends keyof Result>(
	result: Result | Result[],
	keys: Key[]
): Omit<Result, Key> | Omit<Result, Key>[] {
	if (Array.isArray(result)) {
		return result.map((h) => {
			return keys.reduce((acc, key) => {
				delete acc[key];
				return acc;
			}, h);
		});
	}
	return keys.reduce((acc, key) => {
		delete acc[key];
		return acc;
	}, result);
}

export default excludeKeys;
