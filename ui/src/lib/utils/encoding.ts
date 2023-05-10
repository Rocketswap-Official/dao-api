export const encodeDateTime = (val) => {
	//val = !isDate(val) ? new Date(val) : val;
	val = new Date(val);
	return {
		__time__: [
			val.getUTCFullYear(),
			val.getUTCMonth() + 1,
			val.getUTCDate(),
			// val.getUTCHours(),
			20,
			// val.getUTCMinutes(),
			20,
			val.getUTCSeconds(),
			val.getUTCMilliseconds()
		]
	};
};
