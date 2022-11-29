export const encodeDateTime = (val) => {
    //val = !isDate(val) ? new Date(val) : val;
    val = new Date(val)
    return {
      __time__: [
        val.getUTCFullYear(),
        val.getUTCMonth(),
        val.getUTCDate(),
        val.getUTCHours(),
        val.getUTCMinutes(),
        val.getUTCSeconds(),
        val.getUTCMilliseconds(),
      ],
    };
  };