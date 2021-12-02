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

const t = function (key, vars = {}) {

	let str = themeApp.data.translations[key];

	if (!str) {

		str = 'Translation '+key+' is not defined.';

	} else {

		const matches = str.match(/{{(.*?)}}/g) || [];

		if (matches.length > 0) {

			for (const index in matches) {

				let varKey = matches[index];

				varKey = varKey.replaceAll('{{', '').replaceAll('}}', '').trim();
				str = str.replace(matches[index], vars[varKey] || '');
			}

			str = str.trim();
		}
	}

    return str;
};

const formatCurrency = function (value, defaultValue, minimumFractionDigits, maximumFractionDigits) {

	let number = null;

	defaultValue = defaultValue || 0;

    if (!value) {

        number = parseFloat(defaultValue, 10);

    } else {

        number = value;

        if (typeof number === 'string' || number instanceof String) {
            number = number.replace(/[^0-9\.,]+/g, '').trim();
        }

        if (number.length == 0) {

            number = defaultValue;

        } else if (typeof number === 'string' || number instanceof String) {

            number = number.replace(/,/, '.');
        }

        number = parseFloat(number, 10);
    }

    const formatter = Intl.NumberFormat(this.data.locale, {
    	style: 'currency',
        currency: this.data.currency.code,
        minimumFractionDigits: minimumFractionDigits || this.data.currency.decimalPlaces,
        maximumFractionDigits: maximumFractionDigits || this.data.currency.decimalPlaces
    });

    let currencySymbolLeft = null;
    let currencySymbolRight = null;
    let currencyGroup = null;
    let currencyDecimal = null;
    const testGroup1 = ['ZAR', 'EUR', 'AUD', 'PLN'];
    const testGroup2 = ['THB', 'TRY', 'GBP', 'BGN', 'JPY', 'USD', 'CAD', 'CNY', 'HKD', 'PHP', 'NZD', 'MYR', 'MXN', 'KRW', 'INR', 'SGD', 'ILS'];
    const testDecimals1 = ['SEK', 'KRW', 'JPY', 'HUF'];
    const testDecimals2 = ['EUR', 'HRK', 'RUB', 'BRL'];

    if (testGroup1.includes(this.data.currency.code)) {
    	currencyGroup = ' ';
    } else if (testGroup2.includes(this.data.currency.code)) {
    	currencyGroup = ',';
    } else {
    	currencyGroup = '.';
    }

    if (testDecimals1.includes(this.data.currency.code)) {
    	currencyDecimal = ' ';
    } else if (testDecimals2.includes(this.data.currency.code)) {
    	currencyDecimal = ',';
    } else if (this.data.currency.code === 'CHF') {
    	currencyDecimal = "'";
    } else {
    	currencyDecimal = '.';
    }

    const currencyParts = formatter.formatToParts(number);
    const currencySymbol = currencyParts.find(obj => obj.type === 'currency').value;
    const currencyValue = currencyParts.map(item => {

    	if (item.type === 'literal' || item.type === 'currency') {
    		return;
    	} else if (item.type === 'group') {
    		return currencyGroup;
    	} else if (item.type === 'decimal') {
    		return currencyDecimal;
    	}

    	return item.value;

    }).join('');

    if (this.data.currency.code === 'USD' || this.data.currency.code === 'GBP') {
    	currencySymbolLeft = currencySymbol;
    } else {
    	currencySymbolRight = currencySymbol;
    }

    return `${currencySymbolLeft ? currencySymbolLeft+' ' : ''}${currencyValue}${currencySymbolRight ? ' '+currencySymbolRight : ''}`;
};

const animate = function (el, animation, prefix = 'animate__') {

	return new Promise((resolve, reject) => {

		const animationName = `${prefix}${animation}`;
		const node = el && el.nodeType ? el : document.querySelector(el);

		if (node) {

			node.classList.add(`${prefix}animated`, animationName);

			function handleAnimationEnd(e) {

				e.stopPropagation();
				node.classList.remove(`${prefix}animated`, animationName);

				resolve('Animation ended');
			}

			node.addEventListener('animationend', handleAnimationEnd, {once: true});

		} else {

			resolve('Element not found');
		}
	});
};

const loadScript = function (src, data = {}, onLoad, onError) {

	return new Promise((resolve, reject) => {

		if (!src) {
			return;
		}

		let script = document.querySelector('script[src="'+src+'"]') || null;

		if (script) {
			script.remove();
		}

	    script = document.createElement('script');

	    script.src = src;

	    if (typeof onLoad === 'function') {
	    	script.onload = onLoad;
		}

		if (typeof onError === 'function') {
	    	script.onerror = onError;
		}

	    if (Object.entries(data).length > 0) {

	    	for (const key of Object.keys(data)) {
				script.dataset[key] = data[key];
			}
	    }

	    document.head.appendChild(script);
	});
};

const generateUuid = function () {

	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const filterInput = function (el, filter, defaultVal, cb = null) {

	if (!el || !filter) {
		return false;
	}

    const events = [
    	'change',
        'blur'
    ];

    let oldValue = defaultVal ? defaultVal : el.value;
    let oldSelectionStart = el.selectionStart;
    let oldSelectionEnd = el.selectionEnd;

    events.forEach(function(e) {

        el.addEventListener(e, function() {

            if (filter(this.value)) {

                oldValue = this.value;
                oldSelectionStart = this.selectionStart;
                oldSelectionEnd = this.selectionEnd;

                if (typeof cb === 'function') {
                	cb(true);
                }

            } else if (oldValue) {

                this.value = oldValue;
                this.setSelectionRange(oldSelectionStart, oldSelectionEnd);

                if (typeof cb === 'function') {
                	cb(false);
                }

            } else {

                this.value = '';

                if (typeof cb === 'function') {
                	cb(false);
                }
            }
        });
    });
};

export {
	debounce,
	extend,
	t,
	formatCurrency,
	animate,
	loadScript,
	generateUuid,
	filterInput
};