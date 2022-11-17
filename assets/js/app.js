import $ from 'jquery';
import 'intersection-observer';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/tooltip';
import * as utils from './components/utils';
import Cart from './components/cart';
import icons from './components/icons';
import editor from './components/editor';
import common from './components/common';
import SVGInject from '@iconfu/svg-inject';
import dotize from 'dotize';
import picturefill from 'picturefill';
import objectFitImages from 'object-fit-images';
import LazyLoad from 'vanilla-lazyload';
import Handlebars from 'handlebars';

export default class App {

	constructor(store = null) {

		const self = this;

		this.data = store ? store : window.store || {};
		this.data.translations = this.data.translations ? dotize.convert(this.data.translations) : {};
		this.utils = utils;
		this.lazyLoadedItems = [];
		this.cart = new Cart();
		this.icons = icons;

		this.lazyLoad = new LazyLoad({
            show_while_loading: true,
            callback_loading: function (el) {

            	if (el.tagName === 'IMG') {

	                picturefill({
	                    elements: [el]
	                });

	                objectFitImages(el);
	            }

                self.lazyLoadedItems.push(el);
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
		    return new Handlebars.SafeString(self.utils.t(key, options.hash));
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

		    return new Handlebars.SafeString(self.utils.formatCurrency(value, defaultValue, minimumFractionDigits, maximumFractionDigits));
		});

        Handlebars.registerPartial('icon', function(data) {
            return `<img src="${self.data.routes.assetUrl}/assets/icon/${data.icon}.svg" class="svg-inline svg-lazy${data.class ? ' '+data.class : ''}" alt="">`;
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

	    document.dispatchEvent(new CustomEvent('theme:ready', {
	    	detail: this
	    }));

        this.init();
	}

	init() {

		if (this.data.designMode === 'edit') {
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

				        		} else if (!this.lazyLoadedItems.includes(el)) {

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

	        	if (!this.lazyLoadedItems.includes(el)) {
	        		objectFitImages(el);
	        	}
	        }
        }

		if (this.data.klarnaPlacementsClientId) {

			this.utils.loadScript('https://eu-library.klarnaservices.com/lib.js', {
				'clientId': this.data.klarnaPlacementsClientId
			});
		}

		common.init();
	}
}