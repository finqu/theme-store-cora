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

export {
	debounce
};