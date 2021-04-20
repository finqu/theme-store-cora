const uh = require('unsplash');

const createElement = (html) => {
	const template = document.createElement('template');

	template.innerHTML = html.trim();

	return template.content.firstChild;
};

if ('Finqu' in window) {
	if ('theme' in window.Finqu) {
		window.Finqu.theme.customSettingHandler = (setting, domEl, onUpdate) => {
			console.log(setting, domEl);

			if (setting.schema.type === 'unsplash') {
				domEl.appendChild(
					createElement(`
					<button class="btn btn-text" type="button" name="create">Generate image</button>
				`)
				);

				domEl.appendChild(
					createElement(`
					<button class="btn btn-text" type="button" name="remove">Remove image</button>
				`)
				);

				domEl.querySelector('[name="create"]').addEventListener('click', (e) => {
					onUpdate(uh(1920, 1080, 'random'));
				});

				domEl.querySelector('[name="remove"]').addEventListener('click', (e) => {
					onUpdate(null);
				});
			}
		};
	}
}
