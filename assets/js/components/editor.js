import checkCircle1 from '@streamlinehq/streamlinehq/img/streamline-bold/check-circle-1-jUA7gT.svg';

export default {

    init: function() {

    	console.log(checkCircle1);

        document.addEventListener('finqu:section:load', (e) => {
            if (e.target.classList.contains('has-lazy')) {
                window.themeApp.lazyLoad.update(e.target.querySelectorAll('.lazy'));
            }
        });

        document.addEventListener('finqu:section:edit', (e) => {
        	console.log(e);
        });
    }
}