const debounce = function (func, wait, immediate) {

	let timeout = null;

	return function () {

		const context = this;
		const args = arguments;
		const later = function () {

			timeout = null;

			if (!immediate) {
				func.apply(context, args);
			}
		};

		let callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args);
		}
	};
};

const extend = function () {

    let extended = {};
    let deep = false;
    let i = 0;
    const length = arguments.length;

    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }

    const merge = (obj) => {

        for (const prop in obj) {

        	if (Object.prototype.hasOwnProperty.call(obj, prop)) {

	            if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
	                extended[prop] = extend(true, extended[prop], obj[prop]);
	            } else {
	                extended[prop] = obj[prop];
	            }
        	}
        }
    };

    for (; i < length; i++) {
        const obj = arguments[i];
        merge(obj);
    }

    return extended;
};

export {
	debounce,
	extend
};