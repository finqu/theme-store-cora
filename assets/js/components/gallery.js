import PhotoSwipe from 'photoswipe';
import 'photoswipe/dist/photoswipe.css';

export default class Gallery {

	constructor(el, opts, items) {

		this.pswp = null;
		this.$el = $(el);
		this.items = items || [];
		this.imgPreload = true;
		this.opts = Object.assign({
            bgOpacity: 0.85,
            showHideOpacity: true,
            captionEl: false,
            fullscreenEl: false,
            zoomEl: false,
            shareEl: false,
            counterEl: false,
            preloaderEl: false,
            allowPanToNext: false,
            focus: false,
            history: false,
            loop: false,
            maxSpreadZoom: 1,
		    getDoubleTapZoom: function (isMouseClick, item) {
		        return item.initialZoomLevel;
		    }
        }, opts);

        this.$ui = $(`

	        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

			    <div class="pswp__bg"></div>

			    <div class="pswp__scroll-wrap">

			        <div class="pswp__container">

			            <div class="pswp__item"></div>
			            <div class="pswp__item"></div>
			            <div class="pswp__item"></div>

			        </div>

			        <div class="pswp__ui pswp__ui--hidden">

			            <button type="button" class="btn" name="gallery-close">
			            	<img src="${themeApp.data.routes.assetUrl+'/'+themeApp.icons.closeLight}" class="svg-inline" alt="">
			            </button>

			            <button type="button" class="btn" name="gallery-prev">
			                <img src="${themeApp.data.routes.assetUrl+'/'+themeApp.icons.angleLeftLight}" class="svg-inline" alt="">
			            </button>

			            <button type="button" class="btn" name="gallery-next">
			                <img src="${themeApp.data.routes.assetUrl+'/'+themeApp.icons.angleRightLight}" class="svg-inline" alt="">
			            </button>

			        </div>

			    </div>

			</div>

		`);

		this.initialize();
	}

	initialize() {

		const self = this;

		this.addDomItems().then(() => {

			if (this.items.length > 0) {

				this.items.sort((a, b) => a.index - b.index);

				this.$el.on('click.pswpInit', '[data-gallery-item-init]', function() {

					let $parentEl = $(this).parentsUntil('.gallery-item').parent();

					if (!$parentEl.length) {
						$parentEl = $(this).parent('.gallery-item');
					}

					self.init($parentEl.index());
		        });
			}

		}).catch(() => {

			console.log('Failed to load images');
		});
	}

	addDomItems() {

		const self = this;
		const $galleryItems = this.$el.find('.gallery-item');
		const maxLoadIndex = $galleryItems.length;
		let itemsToLoad =  maxLoadIndex;
		let loadIndex = 0;

		return new Promise((resolve, reject) => {

			if ($galleryItems.length > 0) {

				$galleryItems.each(function(i) {

					const $galleryImgSrcEl = $(this).find('[data-gallery-img-src]');
					const $galleryVideoSrcEl = $(this).find('[data-gallery-video-src]');

					if (self.imgPreload && $galleryImgSrcEl.length) {

						const src = $galleryImgSrcEl.data('galleryImgSrc');
						let img = new Image();

						img.onload = function() {

							itemsToLoad--;
							loadIndex++;

							self.items.push({
								index: i,
				                src: src,
				                w: this.width,
				                h: this.height
				            });

				            if (itemsToLoad === 0) {

				            	resolve();

				            } else if (itemsToLoad > 0 && loadIndex === maxLoadIndex) {

				            	reject();
				            }
						}

						img.src = src;

					} else if ($galleryImgSrcEl.length) {

						itemsToLoad--;
						loadIndex++;

						self.items.push({
							index: i,
			                src: $galleryImgSrcEl.data('galleryImgSrc'),
			                w: $galleryImgSrcEl.data('galleryImgWidth'),
			                h: $galleryImgSrcEl.data('galleryImgHeight')
			            });

			            if (itemsToLoad === 0) {

			            	resolve();

			            } else if (itemsToLoad > 0 && loadIndex === maxLoadIndex) {

			            	reject();
			            }

					} else if ($galleryVideoSrcEl.length) {

						itemsToLoad--;
						loadIndex++;

						self.items.push({
							index: i,
			                html: `
			                	<div class="pswp__video-container">
			                		<div class="pswp__video-aspect-ratio-container">
				                		<iframe class="pswp__video" src="${$galleryVideoSrcEl.data('galleryVideoSrc')}" width="960" height="640" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
				                		</div>
			                	</div>
			                `
			            });

			            if (itemsToLoad === 0) {

			            	resolve();

			            } else if (itemsToLoad > 0 && loadIndex === maxLoadIndex) {

			            	reject();
			            }
					}
		        });

			} else {

				resolve();
			}
		});
	}

	prev() {

		this.pswp.prev();
	}

	next() {

		this.pswp.next();
	}

	close() {

		this.pswp.close();
		this.$ui.remove();
		this.unbindEvents();
	}

	destroy() {

		this.$el.off('.pswpInit');
		this.$el.off('.pswp');
		this.unbindEvents();
	}

	init(index) {

		$('body').append(this.$ui);

		this.$closeBtn = this.$ui.find('[name="gallery-close"]');
		this.$prevBtn = this.$ui.find('[name="gallery-prev"]');
		this.$nextBtn = this.$ui.find('[name="gallery-next"]');

		this.opts.index = index;
		this.pswp = new PhotoSwipe(this.$ui[0], null, this.items, this.opts);
        this.pswp.init();

        this.bindEvents();
        this.updateNavigation();
	}

	updateNavigation() {

		let itemCount = this.pswp.options.getNumItemsFn();
		let currentIndex = this.pswp.getCurrentIndex();
		let minIndex = 0;
		let maxIndex = this.pswp.options.getNumItemsFn() - 1;

		if (itemCount === 1) {

			this.$prevBtn.addClass('d-none');
			this.$nextBtn.addClass('d-none');

		} else if (!this.opts.loop) {

			if (currentIndex > minIndex && currentIndex < maxIndex) {

				this.$prevBtn.removeClass('d-none');
				this.$nextBtn.removeClass('d-none');

			} else if (currentIndex === minIndex) {

				this.$prevBtn.addClass('d-none');
				this.$nextBtn.removeClass('d-none');

			} else if (currentIndex === maxIndex) {

				this.$prevBtn.removeClass('d-none');
				this.$nextBtn.addClass('d-none');
			}
		}
	}

	bindEvents() {

		this.pswp.listen('beforeChange', () => {

			this.updateNavigation();
		});

        this.$ui.on('click.pswp', '[name="gallery-close"]', () => {

        	this.close();
        });

        this.$ui.on('click.pswp', '[name="gallery-prev"]', () => {

        	this.prev();
        });

        this.$ui.on('click.pswp', '[name="gallery-next"]', () => {

        	this.next();
        });
	}

	unbindEvents() {

		this.$ui.off('.pswp');
	}
}