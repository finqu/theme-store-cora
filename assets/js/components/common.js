import Gallery from './gallery';
import Swiper from 'swiper';
import SwiperCore, {
	Thumbs,
    Navigation,
    Mousewheel
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/thumbs/thumbs.min.css';
import 'swiper/components/controller/controller.min.css';

SwiperCore.use([
	Thumbs,
    Navigation,
    Mousewheel
]);

export default {
	init: function() {

        const bodyEl = document.querySelector('body');

        this.initMobileNavigation();
        this.initSiteHeader();
        this.initSortByFilters();
        this.initWishlist();
        this.initCartMini();

        if (bodyEl.classList.contains('template-customers-account')) {
            this.initAccount();
        }

        if (bodyEl.classList.contains('template-category')) {
            this.initCategory();
        }

        if (bodyEl.classList.contains('template-customers-register')) {
            this.initRegister();
        }

        if (bodyEl.classList.contains('template-article')) {
		    this.initArticle();
        }

        if (bodyEl.classList.contains('template-product')) {
		    this.initProduct();
        }
	},
    initMobileNavigation: function() {

        const containerEl = document.querySelector('.section-site-header');
        const siteMobileNavigationContainerEl = containerEl.querySelector('.site-mobile-navigation-container');
        const siteMobileNavigationInnerEl = containerEl.querySelector('.site-mobile-navigation-inner');
        const siteMobileNavigationToggleEl = containerEl.querySelector('#site-mobile-navigation-toggle');
        const siteMobileNavigationOverlayEl = containerEl.querySelector('#site-mobile-navigation-overlay');

        siteMobileNavigationToggleEl.addEventListener('click', (e) => {

            siteMobileNavigationContainerEl.classList.add('site-mobile-navigation-visible');
            siteMobileNavigationContainerEl.classList.add('site-mobile-navigation-active');
        });

        siteMobileNavigationOverlayEl.addEventListener('click', (e) => {

            siteMobileNavigationContainerEl.classList.remove('site-mobile-navigation-active');
        });

        siteMobileNavigationContainerEl.addEventListener('transitionend', e => {

            e.preventDefault();

            if (!siteMobileNavigationContainerEl.classList.contains('site-mobile-navigation-active')) {
                siteMobileNavigationContainerEl.classList.remove('site-mobile-navigation-visible');
            }
        });
    },
    initSiteHeader: function() {

        const containerEl = document.querySelector('.section-site-header');

        const initCart = () => {

            const siteHeaderItemCartEl = containerEl.querySelector('.site-header-item-cart');
            const siteHeaderCartContainerEl = containerEl.querySelector('.site-header-cart-container');
            const siteHeaderCartEl = containerEl.querySelector('.site-header-cart');
            const siteHeaderCartContainerOffset = siteHeaderItemCartEl.offsetHeight - 1;

            const delay = 500;
            let delayTimer = null;

            siteHeaderCartContainerEl.style.top = siteHeaderCartContainerOffset+'px';

            siteHeaderItemCartEl.addEventListener('mouseenter', e => {

                siteHeaderItemCartEl.classList.add('cart-mini-expanded');
                siteHeaderCartEl.classList.add('cart-mini-expanded');

                if (delayTimer) {
                    clearTimeout(delayTimer);
                }
            });

            siteHeaderCartContainerEl.addEventListener('mouseenter', e => {

                siteHeaderItemCartEl.classList.add('cart-mini-expanded');
                siteHeaderCartEl.classList.add('cart-mini-expanded');

                if (delayTimer) {
                    clearTimeout(delayTimer);
                }
            });

            siteHeaderItemCartEl.addEventListener('mouseleave', e => {

                delayTimer = setTimeout(() => {
                    siteHeaderItemCartEl.classList.remove('cart-mini-expanded');
                    siteHeaderCartEl.classList.remove('cart-mini-expanded');
                }, delay);
            });

            siteHeaderCartContainerEl.addEventListener('mouseleave', e => {

                delayTimer = setTimeout(() => {
                    siteHeaderItemCartEl.classList.remove('cart-mini-expanded');
                    siteHeaderCartEl.classList.remove('cart-mini-expanded');
                }, delay);
            });
        }

        const initSearch = () => {

            const siteHeaderItemSearchEl = containerEl.querySelector('.site-header-item-search');
            const siteHeaderSearchToggleEl = containerEl.querySelector('#site-header-search-toggle');
            const siteHeaderSearchContainerEl = containerEl.querySelector('.site-header-search-container');

            siteHeaderSearchToggleEl.addEventListener('click', e => {

                siteHeaderSearchContainerEl.classList.add('search-active');

                themeApp.animate(siteHeaderSearchContainerEl, 'fadeInDown');

                const searchOverlayEl = document.createElement('div');

                searchOverlayEl.id = 'search-overlay';
                searchOverlayEl.class = 'd-none';

                document.body.appendChild(searchOverlayEl);

                themeApp.animate(searchOverlayEl, 'fadeIn');

                searchOverlayEl.addEventListener('click', e => {

                    if (!siteHeaderSearchContainerEl.contains(e.target) && siteHeaderSearchContainerEl !== e.target) {

                        themeApp.animate(siteHeaderSearchContainerEl, 'fadeOutUp').then(() => {
                            siteHeaderSearchContainerEl.classList.remove('search-active');
                        });

                        themeApp.animate(searchOverlayEl, 'fadeOut').then(() => {
                            searchOverlayEl.remove();
                        });
                    }
                });
            });
        };

        const initMenu = () => {

            const siteHeaderMenuItemEls = containerEl.querySelectorAll('.site-header-menu-item');

            siteHeaderMenuItemEls.forEach(el => {

                const submenuId = el.dataset.menuChildId;

                if (submenuId) {

                    const submenuEl = containerEl.querySelector('.site-header-submenu[data-submenu-id="'+submenuId+'"]');

                    if (submenuEl) {

                        const submenuHeight = submenuEl.scrollHeight;
                        let inTransition = false;

                        const transitionEndEventHandler = (e) => {

                            submenuEl.classList.remove('site-header-submenu-transition');
                        };

                        const transitionStartEventHandler = (e) => {

                            inTransition = true;
                        };

                        const openEventHandler = (e) => {

                            submenuEl.classList.add('site-header-submenu-transition');
                            submenuEl.classList.add('site-header-submenu-active');
                            submenuEl.style.height = submenuHeight+'px'
                        };

                        const closeEventHandler = (e) => {

                            submenuEl.classList.remove('site-header-submenu-active');

                            submenuEl.style.height = 0+'px';

                            if (!inTransition) {
                                submenuEl.classList.remove('site-header-submenu-transition');
                            }
                        };

                        el.addEventListener('mouseenter', openEventHandler);
                        el.addEventListener('mouseleave', closeEventHandler);

                        submenuEl.addEventListener('mouseenter', openEventHandler);
                        submenuEl.addEventListener('mouseleave', closeEventHandler);
                        submenuEl.addEventListener('transitionend', transitionEndEventHandler);
                    }
                }
            });
        };

        if (window.innerWidth >= 992) {
            initCart();
        }

        initSearch();
        initMenu();
    },
    initAccount: function() {

        const containerEl = document.querySelector('.section-account');
        const localizationFormEl = containerEl.querySelector('#account-localization-form');
        const accountCurrencyEl = containerEl.querySelector('#edit-account-currency');
        const accountLocaleEl = containerEl.querySelector('#edit-account-locale');

        accountCurrencyEl.addEventListener('change', e => {
            localizationFormEl.submit();
        });

        accountLocaleEl.addEventListener('change', e => {
            localizationFormEl.submit();
        });
    },
    initCartMini: function() {

        document.addEventListener('cartRendered', cartReadyEvent => {

            const cartMiniEls = document.querySelectorAll('.cart-mini');

            cartMiniEls.forEach(el => {

                const cartItemsEl = el.querySelector('.cart-items');

                if (cartItemsEl) {

                    if (cartItemsEl.scrollHeight > cartItemsEl.clientHeight) {
                        el.classList.add('cart-mini-items-hint-bottom');
                    } else {
                        el.classList.remove('cart-mini-items-hint-bottom');
                        el.classList.remove('cart-mini-items-hint-top');
                    }

                    cartItemsEl.addEventListener('scroll', scrollEvent => {

                        const height = scrollEvent.target.clientHeight;
                        const offset = scrollEvent.target.scrollTop + height;
                        const minHeight = height;
                        const maxHeight = scrollEvent.target.scrollHeight;

                        if (offset === minHeight) {

                            el.classList.add('cart-mini-items-hint-bottom');

                        } else if (el.classList.contains('cart-mini-items-hint-bottom')) {

                            el.classList.remove('cart-mini-items-hint-bottom');
                        }

                        if (offset === maxHeight) {

                            el.classList.add('cart-mini-items-hint-top');

                        } else if (el.classList.contains('cart-mini-items-hint-top')) {

                            el.classList.remove('cart-mini-items-hint-top');
                        }
                    });
                }
            });
        });
    },
    initRegister: function() {

        const containerEl = document.querySelector('.section-register');
        const registerCtaEl = containerEl.querySelector('#register-cta');
        const checkInputEls = containerEl.querySelectorAll('.form-check-input');

        checkInputEls.forEach(el => { el.addEventListener('change', e => {

            if (Array.from(checkInputEls).every(el => el.checked)) {
                registerCtaEl.disabled = false;
            } else {
                registerCtaEl.disabled = true;
            }
        })});
    },
    initSortByFilters: function() {

        document.querySelectorAll('.sort-by-action').forEach(el => { el.addEventListener('click', e => {
            document.querySelectorAll('[name="sort-by"]')[0].value = e.target.value;
            document.getElementById('product-sort').submit();
        })});

    },
	initCategory: function() {

        const containerEl = document.querySelector('.section-category');
    	const categoryTagsEl = containerEl.querySelector('.category-tags');

    	if (categoryTagsEl) {

    		new Swiper(categoryTagsEl.querySelector('.swiper-container'), {
                slidesPerView: 3,
                spaceBetween: 8,
                freeMode: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    500: {
                        slidesPerView: 4
                    },
                    768: {
                        slidesPerView: 5
                    },
                    992: {
                        slidesPerView: 8
                    }
                }
			});
    	}
	},
	initArticle: function() {

        const containerEl = document.querySelector('.section-article');

		containerEl.querySelectorAll('[name="article-comment-form-show-action"]').forEach(el => { el.addEventListener('click', e => {

    		const commentReplyContainerEl = containerEl.querySelector('#article-comment-form-'+el.value);

    		commentReplyContainerEl.classList.remove('d-none')
    		el.classList.add('d-none');
    	})});

    	containerEl.querySelectorAll('[name="article-comment-form-close-action"]').forEach(el => { el.addEventListener('click', e => {

    		const commentReplyContainerEl = containerEl.querySelector('#article-comment-form-'+el.value);
    		const replyEl = containerEl.querySelector('[name="article-comment-form-show-action"][value="'+el.value+'"]');

    		commentReplyContainerEl.classList.add('d-none')
    		replyEl.classList.remove('d-none');
    	})});
	},
	initWishlist: function() {

		document.querySelectorAll('[data-wishlist-add]').forEach(el => { el.addEventListener('click', e => {

            const iconEl = el.querySelector('.svg-icon');
    		const id = el.getAttribute('data-wishlist-add');
            const itemCountEls = document.querySelectorAll('[data-wislist-item-count]');

    		if (!id) {
    			return;
    		}

    		$.post('/api/wishlist/products/'+id, () => {

                itemCountEls.forEach(el => {

                    const value = (parseInt(el.innerText) || 0) + 1;

                    if (wishlistCount > 0 && !el.parentNode.classList.contains('has-items')) {
                        el.parentNode.classList.add('has-items');
                    }

                    themeApp.animate(el.parentNode, 'bounce');

                    el.innerHTML = value;
                });

                if (iconEl) {
                    themeApp.animate(iconEl, 'pulse');
                }
            });
    	})});

    	document.querySelectorAll('[data-wishlist-remove]').forEach(el => { el.addEventListener('click', e => {

            const iconEl = el.querySelector('.svg-icon');
    		const id = el.getAttribute('data-wishlist-remove');
    		const itemEl = document.querySelector('[data-wishlist-item="'+id+'"]');
            const itemCountEls = document.querySelectorAll('[data-wislist-item-count]');

    		if (!id) {
    			return;
    		}

    		$.delete('/api/wishlist/products/'+id, () => {

                itemCountEls.forEach(el => {

                    const value = (parseInt(el.innerText) || 0) - 1;

                    if (value < 0) {
                        return;
                    }

                    if (value < 1 && el.parentNode.classList.contains('has-items')) {
                        el.parentNode.classList.remove('has-items');
                    }

                    themeApp.animate(el.parentNode, 'bounce');

                    el.innerHTML = value;
                });

                if (iconEl) {
                    themeApp.animate(iconEl, 'pulse');
                }

                if (itemEl) {
                	itemEl.remove();
                }
            });
    	})});

    	document.querySelectorAll('[data-wishlist-toggle]').forEach(el => { el.addEventListener('click', e => {

            const iconEl = el.querySelector('.svg-icon');
    		const id = el.getAttribute('data-wishlist-toggle');
    		const itemEl = document.querySelector('[data-wishlist-item="'+id+'"]');
    		const isAdded = el.getAttribute('aria-pressed') === 'true';
            const itemCountEls = document.querySelectorAll('[data-wislist-item-count]');

    		if (!id) {
    			return;
    		}

    		if (isAdded) {

                $.delete('/api/wishlist/products/'+id, () => {

	                if (itemEl) {
	                	itemEl.remove();
	                }

                    itemCountEls.forEach(el => {

                        const value = (parseInt(el.innerText) || 0) - 1;

                        if (value < 0) {
                            return;
                        }

                        if (value < 1 && el.parentNode.classList.contains('has-items')) {
                            el.parentNode.classList.remove('has-items');
                        }

                        themeApp.animate(el.parentNode, 'bounce');

                        el.innerHTML = value;
                    });

                    if (iconEl) {
                        themeApp.animate(iconEl, 'pulse');
                    }

	                el.setAttribute('aria-pressed', false);
	            });

    		} else {

    			$.post('/api/wishlist/products/'+id, () => {

                    itemCountEls.forEach(el => {

                        const value = (parseInt(el.innerText) || 0) + 1;

                        if (value > 0 && !el.parentNode.classList.contains('has-items')) {
                            el.parentNode.classList.add('has-items');
                        }

                        themeApp.animate(el.parentNode, 'bounce');

                        el.innerHTML = value;
                    });

                    if (iconEl) {
                        themeApp.animate(iconEl, 'pulse');
                    }

	                el.setAttribute('aria-pressed', true);
	            });
    		}
    	})});
	},
    initProduct: function() {

        const containerEl = document.querySelector('.section-product-card');

    	const initProductMedia = () => {

    		const productThumbMediaSwiperEl = containerEl.querySelector('#product-thumb-media-swiper');
    		const productThumbMediaSwiperCfg = {
    			direction: 'vertical',
				spaceBetween: 16,
				slidesPerView: 5,
				freeMode: true,
				watchOverflow: true,
				watchSlidesVisibility: true,
				watchSlidesProgress: true,
                mousewheel: {
                    releaseOnEdges: true,
                },
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}
			};

			const productThumbMediaSwiper = new Swiper(productThumbMediaSwiperEl, productThumbMediaSwiperCfg);
            const productThumbEls = productThumbMediaSwiperEl.querySelectorAll('.swiper-slide');

			const productMainMediaSwiperEl = containerEl.querySelector('#product-main-media-swiper');
			const productMainMediaSwiperCfg = {
				allowTouchMove: true,
				speed: 0,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				},
				thumbs: {
					swiper: productThumbMediaSwiper
				},
                breakpoints: {
                    992: {
                        allowTouchMove: false,
                    }
                }
			};

			const productMainMediaSwiper = new Swiper(productMainMediaSwiperEl, productMainMediaSwiperCfg);
			const productMediaGallery = new Gallery(productMainMediaSwiperEl);

            productThumbEls.forEach((el, index) => { el.addEventListener('mouseover', e => {
                productMainMediaSwiper.slideTo(index, 0, true);
            })});
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
                let sibling = $(this).parentsUntil('.product-variant-container').parent().siblings('.product-subvariant-container[data-variant="'+variantId+'"]');
                let productVariants = [];

                if (!sibling.length) {
                    sibling = $(this).parent().siblings('.product-subvariant-container[data-variant="'+variantId+'"]');
                }

                if ($(this).is(':checkbox')) {

                    sibling = $(this).parentsUntil('.product-variant-container').parent().siblings('.product-subvariant-container[data-option="'+optionId+'"]');

                    if (!sibling.length) {
                        sibling = $(this).parent().siblings('.product-subvariant-container[data-option="'+optionId+'"]');
                    }
                }

                sibling.hide();
                sibling.find('textarea').val('');
                sibling.find('.product-variant').attr('disabled', true);

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

    		const productReviewFormEl = containerEl.querySelector('.product-review-form');
    		const productReviewCreateEl = containerEl.querySelector('[id="product-review-create"]');
    		const productReviewCancelEl = containerEl.querySelector('[id="product-review-cancel"]');
    		const productShowReviewsEl = containerEl.querySelector('[id="product-show-reviews"]');
    		const productReviewCollapseEl = containerEl.querySelector('#accordion-product-reviews');

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