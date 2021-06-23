import 'intersection-observer';
import 'bootstrap';
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
import ImageCarousel from './components/sections/image-carousel';

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
			container: document,
			elements_selector: '.lazy',
            show_while_loading: true,
            callback_loading: function (el) {

                picturefill({
                    elements: [el]
                });

                objectFitImages(el);

                loadedImgs.push(el);
            },
            callback_loaded: function (el) {
            	// Loaded
            },
            callback_error: function (el) {

            	el.src = self.data.placeholderImgSrc;

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
			afterLoad: function(svg, svgString) {
				// Load
			},
			afterInject: function(img, svg) {

				svg.removeAttribute('width');
				svg.removeAttribute('height');
				svg.classList.remove('svg-inline');
				svg.classList.add('svg-icon');

				if (svg.classList.length === 0) {
					svg.removeAttribute('class');
				}
			}
	    });

		const observer = new MutationObserver((mutations) => {

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

		observer.observe(document.querySelector('body'), {
			childList: true,
			subtree: true
		});

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
            return `<img src="${self.data.routes.assetUrl}/assets/${data.icon}.svg" class="svg-inline${data.class ? ' '+data.class : ''}" alt="">`;
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

		Handlebars.registerPartial('placeholderImgSrc', function(data) {
            return self.data.placeholderImgSrc;
        });

		this.hbs = Handlebars;

	    window.themeApp = this;

        for (const el of document.querySelectorAll('img')) {

        	if (el.classList.contains('svg-inline')) {

        		this.SVGInject(el);

        	} else {

	        	if (!loadedImgs.includes(el)) {
	        		objectFitImages(el);
	        	}
	        }
        }

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
		}

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
		}

        if (this.data.designMode) {
        	editor.init();
        }

        this.init();
	}

	init() {

		this.cart.init();
		common.init();

    	for (const el of document.querySelectorAll('.section-image-carousel')) {
    		new ImageCarousel(el);
    	}

	}

    t(key, vars = {}) {

    	let str = this.data.translations[key];

    	if (!str) {

			str = 'Translation '+key+' is not defined.';

		} else {

			const matches = str.match(/__(.*?)__/g) || [];

			if (matches.length > 0) {

				for (const index in matches) {

					const key = matches[index].replaceAll('__', '');

					str = str.replace(matches[index], vars[key] || '');
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

        return number.toLocaleString(this.data.locale, {
            style: 'currency',
            currency: this.data.currency.code,
            minimumFractionDigits: minimumFractionDigits || this.data.currency.decimalPlaces,
            maximumFractionDigits: maximumFractionDigits || this.data.currency.decimalPlaces
        });
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
}