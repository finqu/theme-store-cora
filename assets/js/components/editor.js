import ImageCarousel from './sections/image-carousel';
import ProductCarousel from './sections/product-carousel';

export default {
    init: function() {

        document.addEventListener('finqu:section:load', (e) => {

            if (e.target.classList.contains('has-lazy')) {
                themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
            }

            if (window.KlarnaOnsiteService) {
                window.KlarnaOnsiteService.push({ eventName: 'refresh-placements' });
            }

            if (e.target.classList.contains('section-image-carousel')) {
                new ImageCarousel(e.target);
            }

            if (e.target.classList.contains('section-product-carousel')) {
                new ProductCarousel(e.target);
            }
        });

        document.addEventListener('finqu:block:load', (e) => {

            if (e.target.classList.contains('has-lazy')) {
                themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
            }
        });

        document.addEventListener('finqu:block:edit', (e) => {

            const el = e.detail.settingsContainerEl;
            const radioLabelEls = el.querySelectorAll('.radio-group label');

            for (const labelEl of radioLabelEls) {

                const matches = labelEl.innerHTML.match(/{# (.*?) #}/g) || [];

                if (matches.length > 0) {

                    for (const index in matches) {

                        const arr = Array.from(matches[index].matchAll(/{# icon.(.*?) #}/g));

                        if (arr.length > 0 && arr[0].length >= 2) {

                            const key = arr[0][1];

                            labelEl.innerHTML = labelEl.innerHTML.replace(matches[index], `<img width="15px" src="${ themeApp.data.routes.assetUrl+'/'+themeApp.icons[key] }">`);
                        }
                    }
                }
            }
        });

        document.addEventListener('finqu:section:edit', (e) => {

        	const el = e.detail.settingsContainerEl;
        	const radioLabelEls = el.querySelectorAll('.radio-group label');

        	for (const labelEl of radioLabelEls) {

        		const matches = labelEl.innerHTML.match(/{# (.*?) #}/g) || [];

        		if (matches.length > 0) {

        			for (const index in matches) {

        				const arr = Array.from(matches[index].matchAll(/{# icon.(.*?) #}/g));

                        if (arr.length > 0 && arr[0].length >= 2) {

                            const key = arr[0][1];

						    labelEl.innerHTML = labelEl.innerHTML.replace(matches[index], `<img width="15px" src="${ themeApp.data.routes.assetUrl+'/'+themeApp.icons[key] }">`);
                        }
					}
        		}
        	}
        });
    }
}