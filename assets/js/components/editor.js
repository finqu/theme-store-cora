import ImageCarousel from './sections/image-carousel';
import ProductCarousel from './sections/product-carousel';

export default {
    init: function() {

        document.addEventListener('finqu:section:load', (e) => {

            if (e.target.classList.contains('has-lazy')) {
                themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
            }
        });

        document.addEventListener('finqu:block:load', (e) => {

            if (e.target.classList.contains('has-lazy')) {
                themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
            }

            if (window.KlarnaOnsiteService && e.target.classList.contains('block-klarna')) {
                window.KlarnaOnsiteService.push({ eventName: 'refresh-placements' });
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

                            labelEl.innerHTML = labelEl.innerHTML.replace(matches[index], `<img src="${ themeApp.data.routes.assetUrl+'/'+themeApp.icons[key] }">`);
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

						    labelEl.innerHTML = labelEl.innerHTML.replace(matches[index], `<img src="${ themeApp.data.routes.assetUrl+'/'+themeApp.icons[key] }">`);
                        }
					}
        		}
        	}
        });

        const observer = new MutationObserver((mutations) => {

            mutations.forEach((mutation) => {

                for (const { addedNodes } of mutations) {

                    for (const node of addedNodes) {

                        if (node.tagName && node.nodeType === 1) {

                            if (node.classList.contains('section-product-carousel')) {

                                new ProductCarousel(node);

                            } else if (node.classList.contains('section-image-carousel')) {

                                new ImageCarousel(node);
                            }

                            return;
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}