import 'intersection-observer';
import 'bootstrap';
import editor from './components/editor';
import dotize from 'dotize';
import picturefill from 'picturefill';
import objectFitImages from 'object-fit-images';
import LazyLoad from 'vanilla-lazyload';

export default class App {

	constructor(store = null) {

		this.data = store ? store : window.store || {};

		if (this.data.translations) {
			this.data.translations = dotize.convert(this.data.translations);
		}

		this.lazyLoad = new LazyLoad({
            show_while_loading: true,
            callback_reveal: function (img) {
                picturefill({
                    elements: [img]
                });

                objectFitImages(img);
            },
            callback_loaded: function (img) {
            	// Loaded
            },
            callback_error: function (img) {
               // Error
            }
        });

        if (this.data.designMode) {
        	editor.init();
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