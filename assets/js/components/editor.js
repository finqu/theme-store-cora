export default {
    init: function() {

        document.addEventListener('finqu:section:load', (e) => {
            if (e.target.classList.contains('has-lazy')) {
                themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
            }
        });

        document.addEventListener('finqu:section:edit', (e) => {

        	const el = e.detail.settingsContainerEl;
        	const radioLabelEls = el.querySelectorAll('.radio-group label');

        	for (const labelEl of radioLabelEls) {

        		const matches = labelEl.innerHTML.match(/{# (.*?) #}/g) || [];

        		if (matches.length > 0) {

        			for (const index in matches) {

        				const key = matches[index].match(/(?<=\{# icon.).+?(?=\ #})/g)[0];

        				console.log(key);
        				console.log(matches[index]);
        				console.log(labelEl);
        				console.log(themeApp.icons[key]);

						labelEl.innerHTML = labelEl.innerHTML.replace(matches[index], `<img src="${ themeApp.data.routes.assetUrl+'/'+themeApp.icons[key] }">`);
					}
        		}
        	}
        });
    }
}