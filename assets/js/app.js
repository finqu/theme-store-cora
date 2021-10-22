import $ from 'jquery';
import 'intersection-observer';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/tooltip';
import icons from './components/icons';
import editor from './components/editor';
import common from './components/common';
import Cart from './components/cart';
import SVGInject from '@iconfu/svg-inject';
import dotize from 'dotize';
import picturefill from 'picturefill';
import objectFitImages from 'object-fit-images';
import LazyLoad from 'vanilla-lazyload';
import Handlebars from 'handlebars';
import ImageCarousel from './components/image-carousel';
import ProductCarousel from './components/product-carousel';
import Carousel from './components/carousel';

export default class App {

	constructor(store = null) {

		const self = this;

		this.data = store ? store : window.store || {};

		if (this.data.translations) {
			this.data.translations = dotize.convert(this.data.translations);
		}

		let loadedImgs = [];

		this.cart = new Cart();
		this.icons = icons;
		this.lazyLoad = new LazyLoad({
            show_while_loading: true,
            callback_loading: function (el) {

                picturefill({
                    elements: [el]
                });

                objectFitImages(el);

                loadedImgs.push(el);
            },
            callback_error: function (el) {

            	el.src = self.data.placeholders['image'];
            	el.classList.add('svg-placeholder');

             	picturefill({
                    elements: [el]
                });

                objectFitImages(el);
            }
        });

        this.SVGInject = SVGInject;
        this.SVGInject.setOptions({
			useCache: true,
			copyAttributes: true,
			makeIdsUnique: false,
			afterInject: function(img, svg) {

				svg.removeAttribute('width');
				svg.removeAttribute('height');

				svg.classList.remove('svg-inline');
				svg.classList.add('svg-icon');
			}
	    });

		$.put = function(url, data, callback, type) {

			if ($.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = {};
			}

			return $.ajax({
				url: url,
				type: 'PUT',
				success: callback,
				data: data,
				contentType: type
			});
		};

		$.delete = function(url, data, callback, type) {

			if ($.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = {};
			}

			return $.ajax({
				url: url,
				type: 'DELETE',
				success: callback,
				data: data,
				contentType: type
			});
		};

	    Handlebars.registerHelper('t', function(key, options) {
		    return new Handlebars.SafeString(self.t(key, options.hash));
		});

		Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

		    switch (operator) {
		        case '==':
		            return (v1 == v2) ? options.fn(this) : options.inverse(this);
		        case '===':
		            return (v1 === v2) ? options.fn(this) : options.inverse(this);
		        case '!=':
		            return (v1 != v2) ? options.fn(this) : options.inverse(this);
		        case '!==':
		            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
		        case '<':
		            return (v1 < v2) ? options.fn(this) : options.inverse(this);
		        case '<=':
		            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		        case '>':
		            return (v1 > v2) ? options.fn(this) : options.inverse(this);
		        case '>=':
		            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		        case '&&':
		            return (v1 && v2) ? options.fn(this) : options.inverse(this);
		        case '||':
		            return (v1 || v2) ? options.fn(this) : options.inverse(this);
		        default:
		            return options.inverse(this);
		    }
		});

		Handlebars.registerHelper('join', function(array, separator) {

            if (typeof array === 'string') {
                return array;
            }

            if (!Array.isArray(array)) {
                return '';
            }

            if (typeof separator === 'string' && separator && separator.length !== 0) {
                separator = separator;
            } else {
                separator = ', ';
            }

            return new Handlebars.SafeString(array.join(separator));
        });

        Handlebars.registerHelper('formatCurrency', function(value, defaultValue, minimumFractionDigits, maximumFractionDigits) {

        	value = isNaN(value) ? null : value;
        	defaultValue = isNaN(defaultValue) ? null : defaultValue;
        	minimumFractionDigits = isNaN(minimumFractionDigits) ? null : minimumFractionDigits;
        	maximumFractionDigits = isNaN(maximumFractionDigits) ? null : maximumFractionDigits;

		    return new Handlebars.SafeString(self.formatCurrency(value, defaultValue, minimumFractionDigits, maximumFractionDigits));
		});

        Handlebars.registerPartial('icon', function(data) {
            return `<img src="${self.data.routes.assetUrl}/assets/icon/${data.icon}.svg" class="svg-inline${data.class ? ' '+data.class : ''}" alt="">`;
        });

        Handlebars.registerPartial('placeholder_svg', function(data) {

        	const type = data.type || 'image';
        	let placeholders = null;

        	switch(type) {

				case 'category':
					placeholders = [
						'category-1',
						'category-2',
						'category-3',
						'category-4',
						'category-5',
						'category-6',
						'category-7'
					];
					break;

				case 'background':
					placeholders = [
						'background-1',
						'background-2',
						'background-3'
					];
					break;

				case 'product':
					placeholders = [
						'product-1',
						'product-2',
						'product-3',
						'product-4',
						'product-5',
						'product-6',
						'product-7',
						'product-8',
						'product-9',
						'product-10',
						'product-11',
						'product-12'
					];
					break;

				case 'image':
					placeholders = [
						'image'
					];
					break;
			}

			const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];

			if (data.base64) {

				return 'data:image/svg+xml;base64,'+self.data.placeholders[placeholder];

			} else {

	            return `<img src="data:image/svg+xml;base64,${self.data.placeholders[placeholder]}" class="svg-placeholder${data.class ? ' '+data.class : ''}"${data.width ? ' width="'+data.width+'"' : ''}${data.height ? ' height="'+data.height+'"' : ''} alt="">`;
	        }
        });

        Handlebars.registerPartial('image', function(data) {

        	const src = data.src;
        	const scale = parseInt(data.scale, 10) || 1;
        	const size = data.size.split(',');
        	const width = scale * size[0];
        	const height = scale * (size[1] || size[0]);
        	const extension = src.substring(src.lastIndexOf('.') + 1);
        	const result = src.substring(0, src.lastIndexOf('.'))+'_'+width+'_'+height+'.'+extension;

            return result;
        });

        Handlebars.registerHelper('assign', function (key, val, options) {

		    if (!options.data.root) {
		        options.data.root = {};
		    }

		    options.data.root[key] = val;
		});

		this.hbs = Handlebars;

	    window.themeApp = this;
	    window.jQuery = $;
	    window.$ = $;

	    document.dispatchEvent(new CustomEvent('themeAppReady'));

        this.init();
	}

	init() {

		if (this.data.designMode) {
        	editor.init();
        }

		const mediaObserver = new MutationObserver((mutations) => {

			for (const { addedNodes } of mutations) {

				for (const node of addedNodes) {

					if (node.tagName && node.nodeType === 1) {

						for (const el of node.querySelectorAll('img')) {

				        	if (el.classList.contains('svg-inline')) {

				        		this.SVGInject(el);

				        	} else {

				        		if (el.classList.contains('lazy')) {

				        			this.lazyLoad.update();

				        		} else if (!loadedImgs.includes(el)) {

						        	objectFitImages(el);
				        		}
					        }
				        }
					}
			    }
			}
		});

		mediaObserver.observe(document.querySelector('body'), {
			childList: true,
			subtree: true
		});

		for (const el of document.querySelectorAll('img')) {

        	if (el.classList.contains('svg-inline')) {

        		this.SVGInject(el);

        	} else {

	        	if (!loadedImgs.includes(el)) {
	        		objectFitImages(el);
	        	}
	        }
        }

		if (this.data.klarnaPlacementsClientId) {

			this.loadScript('https://eu-library.klarnaservices.com/lib.js', {
				'clientId': this.data.klarnaPlacementsClientId
			});
		}

		if (!document.querySelector('body').classList.contains('template-password')) {
			this.cart.init();
		}

		common.init();

		if (!this.data.designMode) {

	    	for (const el of document.querySelectorAll('.section-image-carousel')) {
	    		new ImageCarousel(el);
	    	}

	    	for (const el of document.querySelectorAll('.section-product-carousel, .product-carousel')) {
	    		new ProductCarousel(el);
	    	}

	    	for (const el of document.querySelectorAll('.section-carousel')) {
	    		new Carousel(el);
	    	}
	    }
	}

    t(key, vars = {}) {

    	let str = this.data.translations[key];

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
    }

    formatCurrency(value, defaultValue, minimumFractionDigits, maximumFractionDigits) {

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
    }

    animate = (el, animation, prefix = 'animate__') => new Promise((resolve, reject) => {

		const animationName = `${prefix}${animation}`;
		const node = el && el.nodeType ? el : document.querySelector(el);

		node.classList.add(`${prefix}animated`, animationName);

		function handleAnimationEnd(e) {

			e.stopPropagation();
			node.classList.remove(`${prefix}animated`, animationName);

			resolve('Animation ended');
		}

		node.addEventListener('animationend', handleAnimationEnd, {once: true});
	});

	loadScript = (src, data = {}, onLoad, onError) => new Promise((resolve, reject) => {

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

	addDataLayerItem(item) {
        if (window.dataLayer) {
            dataLayer.push(item);
        }
    }

    generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    filterInput = (el, filter, defaultVal, cb = null) => {

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
}