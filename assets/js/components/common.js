import Gallery from './gallery';
import Swiper from 'swiper';
import SwiperCore, {
	Thumbs,
    Navigation
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/thumbs/thumbs.min.css';
import 'swiper/components/controller/controller.min.css';

SwiperCore.use([
	Thumbs,
    Navigation
]);

export default {
	init: function() {
		this.initCategory();
		this.initArticle();
		this.initWishlist();
		this.initProduct();
	},
	initCategory: function() {

		document.querySelectorAll('.sort-by-action').forEach(el => { el.addEventListener('click', e => {
    		document.querySelectorAll('[name="sort-by"]')[0].value = e.target.value;
    		document.getElementById('product-sort').submit();
    	})});

    	const categoryTagsEl = document.querySelector('.category-tags');

    	if (categoryTagsEl) {

    		new Swiper(categoryTagsEl.querySelector('.swiper-container'), {
				slidesPerView: 6,
				spaceBetween: 30,
				freeMode: true
			});
    	}
	},
	initArticle: function() {

		document.querySelectorAll('[name="item-comment-reply-show-action"]').forEach(el => { el.addEventListener('click', e => {

    		const commentReplyContainerEl = document.querySelector('#item-comment-reply-'+el.value);

    		commentReplyContainerEl.classList.remove('d-none')
    		el.classList.add('d-none');
    	})});

    	document.querySelectorAll('[name="item-comment-reply-close-action"]').forEach(el => { el.addEventListener('click', e => {

    		const commentReplyContainerEl = document.querySelector('#item-comment-reply-'+el.value);
    		const replyEl = document.querySelector('[name="item-comment-reply-show-action"][value="'+el.value+'"]');

    		commentReplyContainerEl.classList.add('d-none')
    		replyEl.classList.remove('d-none');
    	})});
	},
	initWishlist: function() {

		document.querySelectorAll('[data-wishlist-add]').forEach(el => { el.addEventListener('click', e => {

    		const id = el.getAttribute('data-wishlist-add');

    		if (!id) {
    			return;
    		}

    		$.post('/api/wishlist/products/'+id);
    	})});

    	document.querySelectorAll('[data-wishlist-remove]').forEach(el => { el.addEventListener('click', e => {

    		const id = el.getAttribute('data-wishlist-remove');
    		const itemEl = document.querySelector('[data-wishlist-item="'+id+'"]');

    		if (!id) {
    			return;
    		}

    		$.delete('/api/wishlist/products/'+id, () => {

                if (itemEl) {
                	itemEl.remove();
                }
            });
    	})});

    	document.querySelectorAll('[data-wishlist-toggle]').forEach(el => { el.addEventListener('click', e => {

    		const id = el.getAttribute('data-wishlist-toggle');
    		const itemEl = document.querySelector('[data-wishlist-item="'+id+'"]');
    		const isAdded = el.getAttribute('aria-pressed') === 'true';

    		if (!id) {
    			return;
    		}

    		if (isAdded) {

    			$.delete('/api/wishlist/products/'+id, () => {

	                if (itemEl) {
	                	itemEl.remove();
	                }

	                el.setAttribute('aria-pressed', false);
	            });

    		} else {

    			$.post('/api/wishlist/products/'+id, () => {
	                el.setAttribute('aria-pressed', true);
	            });
    		}
    	})});
	},
    initProduct: function() {

    	const initProductMedia = () => {

    		const productThumbMediaSwiperEl = '#product-thumb-media-swiper';
    		const productThumbMediaSwiperCfg = {
    			direction: 'vertical',
				spaceBetween: 16,
				slidesPerView: 4,
				freeMode: true,
				watchOverflow: true,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}
			};

			const productThumbMediaSwiper = new Swiper(productThumbMediaSwiperEl, productThumbMediaSwiperCfg);

			const productMainMediaSwiperEl = '#product-main-media-swiper';
			const productMainMediaSwiperCfg = {
				noSwiping: true,
				speed: 0,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				},
				thumbs: {
					swiper: productThumbMediaSwiper
				}
			};

			const productMainMediaSwiper = new Swiper(productMainMediaSwiperEl, productMainMediaSwiperCfg);
			const productMediaGallery = new Gallery(productMainMediaSwiperEl);
    	};

    	const initProductOptions = () => {

    		const productId = $('[name="product_id"]').val();

    		// If variant is visible show it
            $('.product-variant[data-is-usable]').filter(':visible').each(function() {

                $(this).removeAttr('disabled');

                const optionId = $(this).val();

                if ($('.product-subvariant-container[data-option="'+optionId+'"]').length) {

                    $('.product-subvariant-container[data-option="'+optionId+'"]').show();
                    $('.product-subvariant-container[data-option="'+optionId+'"]').find('.product-variant[data-is-usable]').removeAttr('disabled');
                }
            });

            // Variants product price total option
            $('.product-variant.has-price, option.has-price').each(function() {

                if ($(this).is('option')) {

                    $(this).each(function() {

                        const self = this;
                        const variantId = $(this).val();

                        $.get('/api/products/'+productId+'/price?variants['+variantId+']=true', (res) => {
                        	$(self).append('('+res.price+')');
                        });
                    });

                } else if ($(this).is(':checkbox, :radio')) {

                    const self = this;
                    const variantId = $(this).val();

                    $.get('/api/products/'+productId+'/price?variants['+variantID+']=true', (res) => {
                    	$(self).siblings('label').append('('+res.price+')');
                    });

                } else if ($(this).is('textarea')) {

                	const self = this;
                    const variantId = $(this).attr('name');

                    $.get('/api/products/'+productId+'/price?variants['+variantID+']=true', (res) => {
                    	$(self).siblings('label').append('('+res.price+')');
                    });
                }
            });

            $('.product-variant').on('change', function() {

                const variantId = $(this).data('variant');
                const optionId = $(this).val();
                const image = $(this).data('variant-image');
                let other = $(this).parentsUntil('.product-variant-container').parent().siblings('.product-subvariant-container[data-variant="'+variantId+'"]');
                let productVariants = [];

                if (!other.length) {
                    other = $(this).parent().siblings('.product-subvariant-container[data-variant="'+variantId+'"]');
                }

                if ($(this).is(':checkbox')) {

                    other = $(this).parentsUntil('.product-variant-container').parent().siblings('.product-subvariant-container[data-option="'+optionId+'"]');

                    if (!other.length) {
                        other = $(this).parent().siblings('.product-subvariant-container[data-option="'+optionId+'"]');
                    }
                }

                other.hide();
                other.find('textarea').val('');
                other.find('.product-variant').attr('disabled', true);

                // Reset sub-variants if hidden
                $('.product-subvariant-container').filter(':hidden').each(function() {

                    $(this).find('.product-variant').each(function() {

                        if ($(this).is(':checkbox, :radio')) {
                            $(this).prop('checked', false);
                        }

                        if ($(this).is('select')) {
                            $(this).prop('selectedIndex', 0);
                        }
                    });
                });

                // ??
                // Change gallery picture on radio select
                if (image) {
                    $('#' + image).click();
                }

                // Show variants if active
                if (($(this).is('select') && $(this).val()) || ($(this).is(':checkbox, :radio') && $(this).is(':checked')) || ($(this).is('textarea') && $(this).val())) {

                    $('[data-option="'+optionId+'"]').show();
                    $('[data-option="'+optionId+'"]').find('[data-is-usable]').removeAttr('disabled');
                }

                // Get variants prices
                $('.product-variant').each(function() {

                    if ($(this).is('select') && $(this).val()) {

                        productVariants.push('variants['+$(this).val()+']');

                    } else if ($(this).is(':checkbox, :radio') && $(this).is(':checked')) {

                        productVariants.push('variants['+$(this).val()+']');

                    } else if ($(this).is('textarea') && $(this).val()) {

                        productVariants.push('variants['+$(this).attr('name')+']');
                    }
                });

                // Get jsons and change prices
                $.get('/api/products/'+productId+'/price?'+productVariants.join('&')+'=true', (res) => {
                    $('[data-product-price-dynamic]').html(themeApp.formatCurrency(res.price));
                });
            });
    	};

    	const initProductReviews = () => {

    		const productReviewFormEl = document.querySelector('.product-review-form');
    		const productReviewCreateEl = document.querySelector('[name="product-review-create"]');
    		const productReviewCancelEl = document.querySelector('[name="product-review-cancel"]');
    		const productShowReviewsEl = document.querySelector('[name="product-show-reviews"]');
    		const productReviewCollapseEl = document.querySelector('#accordion-product-reviews');

    		if (productReviewCreateEl) {

	    		productReviewCreateEl.addEventListener('click', e => {

	    			productReviewFormEl.classList.remove('d-none');
	    			e.target.classList.add('d-none');
	    		});
	    	}

	    	if (productReviewCancelEl) {

	    		productReviewCancelEl.addEventListener('click', e => {

	    			productReviewFormEl.classList.add('d-none');
	    			productReviewCreateEl.classList.remove('d-none');
	    		});
	    	}

	    	if (productShowReviewsEl) {

	    		productShowReviewsEl.addEventListener('click', e => {

	    			if (productReviewCollapseEl) {

		    			$(productReviewCollapseEl).collapse('show');

		    			$('html, body').animate({
		                    scrollTop: $(productReviewCollapseEl).offset().top
		                }, 500);
		    		}
	    		});
	    	}
    	};

    	initProductMedia();
    	initProductOptions();
    	initProductReviews();
    }
}