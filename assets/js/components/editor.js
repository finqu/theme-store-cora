import MoveLeft1 from '@streamlinehq/streamlinehq/img/streamline-light/move-left-1-fSZYq5.svg';
import MoveRight1 from '@streamlinehq/streamlinehq/img/streamline-light/move-right-1-fSZYYL.svg';
import MoveDown1 from '@streamlinehq/streamlinehq/img/streamline-light/move-down-1-fSZQ4o.svg';
import MoveUp1 from '@streamlinehq/streamlinehq/img/streamline-light/move-up-1-hNEO9b.svg';
import ShrinkHorizontal from '@streamlinehq/streamlinehq/img/streamline-light/shrink-horizontal-y7qSce.svg';
import ShrinkVertical from '@streamlinehq/streamlinehq/img/streamline-light/shrink-vertical-y7qZWz.svg';

export default {
	icons: {
		alignLeft: MoveLeft1,
		alignCenter: ShrinkHorizontal,
		alignRight: MoveRight1,
		alignTop: MoveUp1,
		alignMiddle: ShrinkVertical,
		alignBottom: MoveDown1
	},

    init: function() {

        document.addEventListener('finqu:section:load', (e) => {
            if (e.target.classList.contains('has-lazy')) {
                window.themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
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

						labelEl.innerHTML = labelEl.innerHTML.replace(matches[index], `<img src="${ window.themeApp.data.assetUrl+'/'+this.icons[key] }">`);
					}
        		}
        	}
        });
    }
}