import 'intersection-observer';
import 'bootstrap';
import icons from './components/icons.js';
import editor from './components/editor';
import SVGInject from '@iconfu/svg-inject';
import dotize from 'dotize';
import picturefill from 'picturefill';
import objectFitImages from 'object-fit-images';
import LazyLoad from 'vanilla-lazyload';
import ImageCarousel from './components/sections/image-carousel';

export default class App {

	constructor(store = null) {

		this.data = store ? store : window.store || {};

		if (this.data.translations) {
			this.data.translations = dotize.convert(this.data.translations);
		}

		let loadedImgs = [];

		this.icons = icons;
		this.lazyLoad = new LazyLoad({
            show_while_loading: true,
            callback_reveal: function (img) {
                picturefill({
                    elements: [img]
                });

                objectFitImages(img);

                loadedImgs.push(img);
            },
            callback_loaded: function (img) {
            	// Loaded
            },
            callback_error: function (img) {
               // Error
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

	    window.themeApp = this;

        for (const el of document.querySelectorAll('img')) {

        	if (el.classList.contains('svg-inline')) {

        		this.SVGInject(el);

        	} else {

	        	if (loadedImgs.includes(el)) {
	        		objectFitImages(el);
	        	}
	        }
        }

        if (this.data.designMode) {
        	editor.init();
        }

        this.init();
	}

	init() {

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
}