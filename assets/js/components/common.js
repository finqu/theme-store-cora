import $ from 'jquery';
import Gallery from './gallery';
import Swiper, { Navigation, Thumbs, Mousewheel, FreeMode } from 'swiper';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/mousewheel';
import 'swiper/css/free-mode';
import { debounce } from './utils';
import picturefill from 'picturefill';
import objectFitImages from 'object-fit-images';
import LazyLoad from 'vanilla-lazyload';
import ImageCarousel from './image-carousel';
import ProductCarousel from './product-carousel';
import Carousel from './carousel';
import noUiSlider from 'nouislider';

export default {
	init: function() {

        const bodyEl = document.querySelector('body');

        if (themeApp.data.designMode !== 'edit') {

            for (const el of document.querySelectorAll('.section-image-carousel')) {
                new ImageCarousel(el);
            }

            for (const el of document.querySelectorAll('.section-product-carousel, .product-carousel')) {
                new ProductCarousel(el);
            }

            for (const el of document.querySelectorAll('.section-carousel, .category-carousel')) {
                new Carousel(el);
            }

            this.initCookiePolicy();
            this.initBackToTopButton();
        }

        if (bodyEl.querySelector('#site-localization-form')) {
            this.initLocalization();
        }

        if (!bodyEl.classList.contains('template-password')) {
            themeApp.cart.init();
            this.initMobileNavigation();
            this.initSiteHeader();
            this.initWishlist();
            this.initCartMini();
        }

        if ((!bodyEl.classList.contains('template-catalog') || !bodyEl.classList.contains('template-category')) && !bodyEl.classList.contains('template-password')) {
            this.initSortByFilters();
        }

        if (bodyEl.classList.contains('template-password')) {
            this.initPassword();
        }

        if (bodyEl.classList.contains('template-customers-account')) {
            this.initAccount();
        }

        if (bodyEl.classList.contains('template-category')) {
            this.initCategory();
        }

        if (bodyEl.classList.contains('template-catalog')) {
            this.initCatalog();
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
    initPassword: function() {
        const containerEl = document.querySelector('.section-password');
        const passwordOverlayContainerEl = document.querySelector('.password-overlay-container');
        const passwordOverlayActionShowEl = containerEl.querySelector('#password-overlay-action-show');
        const passwordOverlayActionHideEl = containerEl.querySelector('#password-overlay-action-hide');

        passwordOverlayActionShowEl.addEventListener('click', (e) => {
            passwordOverlayContainerEl.classList.add('active');
        });

        passwordOverlayActionHideEl.addEventListener('click', (e) => {
            passwordOverlayContainerEl.classList.remove('active');
        });
    },
    initMobileNavigation: function() {

        const containerEl = document.querySelector('.section-site-header');
        const siteMobileNavigationContainerEl = containerEl.querySelector('.site-mobile-navigation-container');
        const siteMobileNavigationInnerEl = containerEl.querySelector('.site-mobile-navigation-inner');
        const siteMobileNavigationToggleEl = containerEl.querySelector('.site-mobile-navigation-toggle');
        const siteMobileNavigationOverlayEl = containerEl.querySelector('.site-mobile-navigation-overlay');

        const siteMobileNavigationLayerChildEls = containerEl.querySelectorAll('.site-mobile-navigation-layer-child');
        const siteMobileNavigationShowLayerEls = containerEl.querySelectorAll('[name="site-mobile-navigation-show-layer"]');
        const siteMobileNavigationHideLayerEls = containerEl.querySelectorAll('[name="site-mobile-navigation-hide-layer"]');

        siteMobileNavigationLayerChildEls.forEach(el => { el.addEventListener('transitionend', (e) => {

            e.preventDefault();

            if (!el.classList.contains('site-mobile-navigation-layer-active')) {
                el.classList.remove('site-mobile-navigation-layer-visible');
            }
        })});

        siteMobileNavigationShowLayerEls.forEach(el => { el.addEventListener('click', (e) => {

            const id = e.target.value;
            const navigationLayerEl = containerEl.querySelector('.site-mobile-navigation-layer[data-mobile-navigation-layer-id="'+id+'"]');

            navigationLayerEl.classList.add('site-mobile-navigation-layer-visible');
            navigationLayerEl.classList.add('site-mobile-navigation-layer-active');
        })});

        siteMobileNavigationHideLayerEls.forEach(el => { el.addEventListener('click', (e) => {

            const id = e.target.value;
            const navigationLayerEl = containerEl.querySelector('.site-mobile-navigation-layer[data-mobile-navigation-layer-id="'+id+'"]');

            navigationLayerEl.classList.remove('site-mobile-navigation-layer-active');
        })});

        siteMobileNavigationToggleEl.addEventListener('click', (e) => {

            siteMobileNavigationContainerEl.classList.add('site-mobile-navigation-visible');
            siteMobileNavigationContainerEl.classList.add('site-mobile-navigation-active');
            siteMobileNavigationOverlayEl.classList.add('site-mobile-navigation-overlay-active');

            document.body.classList.add('disable-scroll');
        });

        siteMobileNavigationOverlayEl.addEventListener('click', (e) => {

            siteMobileNavigationContainerEl.classList.remove('site-mobile-navigation-active');
            siteMobileNavigationOverlayEl.classList.remove('site-mobile-navigation-overlay-active');

            document.body.classList.remove('disable-scroll');
        });

        siteMobileNavigationContainerEl.addEventListener('transitionend', e => {

            e.preventDefault();

            if (!siteMobileNavigationContainerEl.classList.contains('site-mobile-navigation-active')) {
                siteMobileNavigationContainerEl.classList.remove('site-mobile-navigation-visible');
            }
        });

        const stickyHeaderEl = containerEl.querySelector('.site-mobile-header-sticky');
        let stickyHeaderOffsetHeight = null;

        const getStickyHeaderOffsetTop = () => {

            let result = 0;
            const klarnaBannerEl = document.querySelector('.site-klarna-banner');
            const announcementEl = document.querySelector('.site-announcement-container');

            if (klarnaBannerEl) {
                result += klarnaBannerEl.offsetHeight;
            }

            if (announcementEl) {
                result += announcementEl.offsetHeight;
            }

            return result;
        };

        const initStickyHeader = () => {

            stickyHeaderOffsetHeight = stickyHeaderEl.offsetHeight;

            const position = window.getComputedStyle(stickyHeaderEl).position;
            const requiresAdjust = position !== 'absolute' && position !== 'fixed' ? true : false;
            const eHandler = () => {

                if (window.innerWidth >= 992) {
                    return;
                }

                if (window.scrollY >= getStickyHeaderOffsetTop()) {

                    if (!stickyHeaderEl.classList.contains('is-sticky')) {

                        stickyHeaderEl.classList.add('is-sticky');

                        if (requiresAdjust) {
                            document.body.style.paddingTop = stickyHeaderOffsetHeight+'px';
                        }
                    }

                } else {

                    stickyHeaderEl.classList.remove('is-sticky');

                    if (document.body.style.paddingTop) {
                        document.body.style.paddingTop = null;
                    }
                }
            };

            window.addEventListener('scroll', eHandler);
            window.addEventListener('resize', debounce(() => {

                if (window.innerWidth < 992) {

                    const position = window.getComputedStyle(stickyHeaderEl).position;
                    const requiresAdjust = position !== 'absolute' && position !== 'fixed' ? true : false;

                    if (requiresAdjust) {
                        stickyHeaderEl.classList.remove('is-sticky');
                    }

                    stickyHeaderOffsetHeight = stickyHeaderEl.offsetHeight;

                } else {

                    if (document.body.style.paddingTop) {
                        document.body.style.paddingTop = null;
                    }
                }
            }, 150, false));
        };

        if (stickyHeaderEl) {
            initStickyHeader();
        }
    },
    initSiteHeader: function() {

        const containerEl = document.querySelector('.section-site-header');

        const initCart = () => {

            const siteHeaderItemCartEl = containerEl.querySelector('.site-header-item-cart');
            const siteHeaderCartContainerEl = containerEl.querySelector('.site-header-cart-container');
            const siteHeaderCartEl = containerEl.querySelector('.site-header-cart');
            const siteHeaderLogoImgEl = containerEl.querySelector('.site-header-logo');
            const siteHeaderActionsContainerEl = containerEl.querySelector('.site-header-actions-container');
            const iconsToLoad = siteHeaderActionsContainerEl.querySelectorAll('.svg-lazy').length;
            let iconsLoaded = 0;

            if (siteHeaderLogoImgEl && siteHeaderLogoImgEl.classList.contains('svg-lazy')) {

                const logoObserver = new MutationObserver((mutations) => {

                    for (const { target } of mutations) {

                        if (target.classList.contains('loaded')) {

                            const siteHeaderCartContainerOffset = siteHeaderItemCartEl.offsetTop + siteHeaderItemCartEl.clientHeight;

                            siteHeaderCartContainerEl.style.top = siteHeaderCartContainerOffset + 1 + 'px';

                            logoObserver.disconnect();

                            break;
                        }
                    }
                });

                logoObserver.observe(siteHeaderLogoImgEl, {
                    attributes: true,
                    attributeFilter: ['class'],
                    childList: false,
                    characterData: false
                });

            } else {

                const siteHeaderCartContainerOffset = siteHeaderItemCartEl.offsetTop + siteHeaderItemCartEl.clientHeight;

                siteHeaderCartContainerEl.style.top = siteHeaderCartContainerOffset + 1 + 'px';
            }

            if (iconsToLoad > 0) {

                const iconObserver = new MutationObserver((mutations) => {

                    for (const { addedNodes } of mutations) {

                        for (const node of addedNodes) {

                            if (node.tagName && node.nodeType === 1) {

                                if (node.hasAttribute('data-inject-url')) {

                                    iconsLoaded++;

                                    if (iconsLoaded == iconsToLoad) {

                                        const siteHeaderCartContainerOffset = siteHeaderItemCartEl.offsetTop + siteHeaderItemCartEl.clientHeight;

                                        siteHeaderCartContainerEl.style.top = siteHeaderCartContainerOffset + 1 + 'px';

                                        iconObserver.disconnect();

                                        break;
                                    }
                                }
                            }
                        }
                    }
                });

                iconObserver.observe(siteHeaderActionsContainerEl, {
                    childList: true,
                    subtree: true
                });
            }

            if ((!siteHeaderLogoImgEl || !siteHeaderLogoImgEl.classList.contains('svg-lazy')) || iconsToLoad == 0) {

                const siteHeaderCartContainerOffset = siteHeaderItemCartEl.offsetTop + siteHeaderItemCartEl.clientHeight;

                siteHeaderCartContainerEl.style.top = siteHeaderCartContainerOffset + 1 + 'px';
            }

            const delay = 500;
            let delayTimer = null;

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

            const siteSearchEls = containerEl.querySelectorAll('.site-search');
            const siteHeaderSearchToggleEls = containerEl.querySelectorAll('.site-search-toggle');
            const siteHeaderSearchContainerEl = containerEl.querySelector('.site-search-container');
            const siteHeaderSearchInputEl = siteHeaderSearchContainerEl.querySelector('[name="q"]');

            const search = (siteSearchEl, siteSearchResultsEl, q) => {

                if (!q) {

                    siteSearchEl.classList.remove('active');

                    siteSearchResultsEl.innerHTML = '';

                    return;
                }

                if (window.themeApp.data.searchAutocomplete) {

                    $.get('/api/search/suggest', {
                        q: q
                    }, (res) => {

                        siteSearchEl.classList.add('active');

                        if (res.length > 0) {

                            siteSearchResultsEl.innerHTML = res.map(item => `
                                <a href="${item.url}" class="site-search-result-item" tabindex="0">
                                    <span class="site-search-result-item-text">
                                        ${item.title}
                                    </span>
                                </a>
                            `).join('');

                        } else {

                            siteSearchResultsEl.innerHTML = `
                                <div class="site-search-no-results">
                                    <span class="site-search-no-results-text">
                                        ${window.themeApp.utils.t('general.search_no_results')}
                                    </span>
                                </div>
                            `;
                        }

                        document.dispatchEvent(new CustomEvent('theme:search', {
                            detail: {
                                query: q,
                                items: res
                            }
                        }));
                    });
                    
                } else {

                    document.dispatchEvent(new CustomEvent('theme:search', {
                        detail: {
                            query: q
                        }
                    }));
                }
            }

            siteSearchEls.forEach(el => {

                const siteSearchQueryEl = el.querySelector('input[name="q"]');
                const siteSearchResultsEl = el.querySelector('.site-search-results');

                siteSearchQueryEl.addEventListener('input', debounce((e) => {
                    search(el, siteSearchResultsEl, e.target.value);
                }, 300, false));
            });

            siteHeaderSearchToggleEls.forEach(el => { el.addEventListener('click', e => {

                if (siteHeaderSearchContainerEl.classList.contains('site-search-active')) {
                    return;
                }

                siteHeaderSearchContainerEl.classList.add('site-search-active');

                themeApp.utils.animate(siteHeaderSearchContainerEl, 'fadeInDown');

                const searchOverlayEl = document.createElement('div');

                searchOverlayEl.id = 'search-overlay';
                searchOverlayEl.class = 'd-none';

                document.body.appendChild(searchOverlayEl);

                themeApp.utils.animate(searchOverlayEl, 'fadeIn');
                siteHeaderSearchInputEl.focus();

                searchOverlayEl.addEventListener('click', e => {

                    if (!siteHeaderSearchContainerEl.contains(e.target) && siteHeaderSearchContainerEl !== e.target) {

                        themeApp.utils.animate(siteHeaderSearchContainerEl, 'fadeOutUp').then(() => {
                            siteHeaderSearchContainerEl.classList.remove('site-search-active');
                        });

                        themeApp.utils.animate(searchOverlayEl, 'fadeOut').then(() => {
                            searchOverlayEl.remove();
                        });
                    }
                });
            })});
        };

        const initMenu = () => {

            const siteHeaderContainerEl = containerEl.querySelector('.site-header-container');
            const siteHeaderMenuItemEls = containerEl.querySelectorAll('.site-header-menu-item');
            const submenuCloseDelay = 600;
            const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
            const isMegamenu = siteHeaderContainerEl.classList.contains('site-header-megamenu');

            siteHeaderMenuItemEls.forEach(el => {

                const menuItemEl = el;
                const menuItemTextEl = el.querySelector('.site-header-menu-item-text');
                const submenuId = el.dataset.headerMenuChildId;

                if (submenuId) {

                    const submenuEl = containerEl.querySelector('.site-header-submenu[data-header-submenu-id="'+submenuId+'"]');

                    if (submenuEl) {

                        const submenuHeight = submenuEl.scrollHeight;
                        let closeHandleTimer = null;

                        const closeSubmenu = (el) => {

                            el.classList.add('site-header-submenu-recently-active');

                            setTimeout(() => {
                                el.classList.remove('site-header-submenu-recently-active');
                            }, 100);

                            el.style.height = 0+'px';
                            el.style.overflow = 'hidden';

                            closeHandleTimer = null;

                            if (isTouchDevice) {
                                menuItemEl.classList.remove('site-header-menu-item-clicked');
                            }
                        };

                        const transitionEndEventHandler = (e) => {

                            if (e.target.style.height === '0px') {
                                submenuEl.classList.remove('site-header-submenu-transition');
                                submenuEl.classList.remove('site-header-submenu-active');
                                submenuEl.style.overflow = null;
                            } else {
                                submenuEl.style.overflow = 'visible';
                            }
                        };

                        const openEventHandler = (e) => {

                            if ((e.target.isEqualNode(submenuEl) || e.target.isEqualNode(menuItemEl)) && closeHandleTimer !== null) {
                                clearTimeout(closeHandleTimer);
                            }

                            const activeSubmenus = containerEl.querySelectorAll('.site-header-submenu-active');

                            if (activeSubmenus.length > 0) {

                                activeSubmenus.forEach(el => {

                                    if (!el.isEqualNode(submenuEl)) {

                                        el.classList.remove('site-header-submenu-transition');
                                        el.classList.remove('site-header-submenu-active');

                                        closeSubmenu(el);
                                    }
                                });

                                setTimeout(() => {
                                    submenuEl.classList.add('site-header-submenu-transition');
                                }, 100);

                            } else {

                                submenuEl.classList.add('site-header-submenu-transition');
                            }

                            if (!isMegamenu) {

                                const submenuWidth = submenuEl.querySelector('.container').getBoundingClientRect().width;
                                const bodyPosRight = document.body.getBoundingClientRect().right;
                                let submenuPosLeft = menuItemEl.getBoundingClientRect().left;
                                const submenuPosRight = submenuPosLeft + submenuWidth;

                                if (submenuPosRight > bodyPosRight) {
                                    submenuPosLeft = submenuPosLeft - (submenuPosRight - bodyPosRight);
                                }

                                submenuEl.style.left = submenuPosLeft+'px';
                                submenuEl.style.right = 'auto';
                            }

                            submenuEl.classList.add('site-header-submenu-active');
                            submenuEl.style.height = submenuHeight+'px';
                        };

                        const closeEventHandler = (e) => {

                            closeHandleTimer = setTimeout(() => {

                               if (submenuEl.classList.contains('site-header-submenu-active')) {
                                   closeSubmenu(submenuEl);
                               }

                            }, submenuCloseDelay);
                        };

                        const touchClickEventHandler = (e) => {

                            if (!menuItemEl.classList.contains('site-header-menu-item-clicked')) {

                                e.preventDefault();

                                menuItemEl.classList.add('site-header-menu-item-clicked');

                            } else {

                                menuItemEl.classList.remove('site-header-menu-item-clicked');
                            }
                        };

                        menuItemEl.addEventListener('mouseenter', openEventHandler);
                        menuItemEl.addEventListener('mouseleave', closeEventHandler);

                        if (isTouchDevice) {
                            menuItemEl.querySelector('.site-header-menu-item-text').addEventListener('click', touchClickEventHandler);
                        }

                        submenuEl.addEventListener('mouseenter', openEventHandler);
                        submenuEl.addEventListener('mouseleave', closeEventHandler);
                        submenuEl.addEventListener('transitionend', transitionEndEventHandler);
                    }
                }
            });
        };

        const stickyHeaderEl = containerEl.querySelector('.site-header-sticky');
        let stickyHeaderOffsetHeight = null;

        const getStickyHeaderOffsetTop = () => {

            let result = 0;
            const klarnaBannerEl = document.querySelector('.site-klarna-banner');
            const announcementEl = document.querySelector('.site-announcement-container');

            if (klarnaBannerEl) {
                result += klarnaBannerEl.offsetHeight;
            }

            if (announcementEl) {
                result += announcementEl.offsetHeight;
            }

            return result;
        };

        const initStickyHeader = () => {

            stickyHeaderOffsetHeight = stickyHeaderEl.offsetHeight;

            const position = window.getComputedStyle(stickyHeaderEl).position;
            const requiresAdjust = position !== 'absolute' && position !== 'fixed' ? true : false;
            let resized = false;
            const eHandler = () => {

                if (window.innerWidth < 992) {
                    return;
                }

                if (window.scrollY >= getStickyHeaderOffsetTop()) {

                    if (!stickyHeaderEl.classList.contains('is-sticky')) {

                        stickyHeaderEl.classList.add('is-sticky');

                        if (requiresAdjust) {
                            document.body.style.paddingTop = stickyHeaderOffsetHeight+'px';
                        }
                    }

                } else {

                    stickyHeaderEl.classList.remove('is-sticky');

                    if (document.body.style.paddingTop) {
                        document.body.style.paddingTop = null;
                    }
                }
            };

            window.addEventListener('scroll', eHandler);
            window.addEventListener('resize', debounce(() => {

                if (window.innerWidth >= 992) {

                    const position = window.getComputedStyle(stickyHeaderEl).position;
                    const requiresAdjust = position !== 'absolute' && position !== 'fixed' ? true : false;

                    if (requiresAdjust) {
                        stickyHeaderEl.classList.remove('is-sticky');
                    }

                    stickyHeaderOffsetHeight = stickyHeaderEl.offsetHeight;

                    if (resized === true) {

                        document.body.style.paddingTop = stickyHeaderOffsetHeight+'px';

                        resized = false;
                    }

                } else {

                    if (document.body.style.paddingTop) {

                        document.body.style.paddingTop = null;

                        resized = true;
                    }
                }
            }, 150, false));
        };

        if (stickyHeaderEl) {
            initStickyHeader();
        }

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

        document.addEventListener('theme:cart:render', cartRenderEvent => {

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

            const url = new URL(window.location);

            url.searchParams.set('sort-by', e.target.value);

            window.location = url.href;
        })});

    },
	initCategory: function() {

        const containerEl = document.querySelector('.section-category');
        const categorySubcategoriesEl = containerEl.querySelector('.category-subcategories');
        let categoryFiltersFormEl = null;

        if (window.innerWidth < 992) {
            categoryFiltersFormEl = containerEl.querySelector('.filters-mobile-navigation-container .category-filters');
        } else {
            categoryFiltersFormEl = containerEl.querySelector('.category-filters');
        }

        const $categoryFiltersFormEl = $(categoryFiltersFormEl);
        const categoryFilterInputEls = containerEl.querySelectorAll('input');
        const categoryRangeSliderEls = containerEl.querySelectorAll('.range-slider');
        const facetResultCountEls = containerEl.querySelectorAll('[data-facet-result-count]');
        const filtersMobileNavigationCtaEl = containerEl.querySelector('.filters-mobile-navigation-container .filters-mobile-navigation-footer-inner-cta');
        let categoryDynamicContentEl = containerEl.querySelector('.category-dynamic-content');
        let isProcessing = false;

        const renderDynamicContent = (url, scrollTop = false) => {

            const xhr = new XMLHttpRequest();

            isProcessing = true;

            categoryRangeSliderEls

            categoryRangeSliderEls.forEach(el => {
                el.setAttribute('disabled', true);
            });

            categoryFilterInputEls.forEach(el => {
                el.disabled = true;
            });

            categoryDynamicContentEl.querySelectorAll('.sort-by-action').forEach(el => {
                el.disabled = true;
            });

            categoryDynamicContentEl.querySelector('.paginate-item-previous').disabled = true;
            categoryDynamicContentEl.querySelector('.paginate-item-next').disabled = true;

            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {

                if (xhr.readyState === 4) {

                    const dom = new DOMParser().parseFromString(xhr.responseText, 'text/html');
                    const newCategoryDynamicContent = dom.querySelector('.section-category .category-dynamic-content');
                    const itemCount = dom.querySelector('[data-category-items-count]').getAttribute('data-category-items-count');

                    facetResultCountEls.forEach(el => {
                        el.innerText = dom.querySelector('[data-facet-result-count="'+el.dataset.facetResultCount+'"]').innerText;
                    });

                    if (itemCount == 1) {

                        filtersMobileNavigationCtaEl.innerText = window.themeApp.utils.t('filters.show_result', {
                            amount: itemCount
                        });

                    } else {

                        filtersMobileNavigationCtaEl.innerText = window.themeApp.utils.t('filters.show_result_plural', {
                            amount: itemCount
                        });
                    }

                    categoryDynamicContentEl.replaceWith(newCategoryDynamicContent);
                    categoryDynamicContentEl = newCategoryDynamicContent;

                    if (history.pushState) {
                        window.history.pushState({path:url},'',url);
                    }

                    isProcessing = false;

                    categoryRangeSliderEls.forEach(el => {
                        el.removeAttribute('disabled');
                    });

                    categoryFilterInputEls.forEach(el => {
                        el.disabled = false;
                    });

                    categoryDynamicContentEl.querySelectorAll('.sort-by-action').forEach(el => {
                        el.disabled = false;
                    });

                    categoryDynamicContentEl.querySelector('.paginate-item-previous').disabled = false;
                    categoryDynamicContentEl.querySelector('.paginate-item-next').disabled = false;

                    if (scrollTop) {
                        document.body.scrollTop = containerEl.offsetTop;
                        document.documentElement.scrollTop = containerEl.offsetTop;
                    }

                    bindEvents();
                }
            };

            xhr.send();
        };

        const bindEvents = () => {

            const categoryResetFiltersEl = categoryDynamicContentEl.querySelector('.category-reset-filters');

            containerEl.querySelectorAll('.sort-by-action').forEach(el => { el.addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                const url = new URL(window.location);

                url.searchParams.set('sort-by', e.target.value);

                renderDynamicContent(url.href);
            })});

            containerEl.querySelector('.paginate-item-previous').addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                e.preventDefault();

                if (e.target.hasAttribute('href')) {
                    renderDynamicContent(e.target.getAttribute('href'), true);
                }
            });

            containerEl.querySelector('.paginate-item-next').addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                e.preventDefault();

                if (e.target.hasAttribute('href')) {
                    renderDynamicContent(e.target.getAttribute('href'), true);
                }
            });

            categoryDynamicContentEl.querySelectorAll('.category-remove-filter').forEach(el => { el.addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                categoryFiltersFormEl.querySelectorAll('.input-'+el.value).forEach(el => {

                    if (el.type === 'checkbox' || el.type ==='radio') {

                        el.checked = false;

                    } else if (el.type === 'number') {

                        el.value = '';

                    } else if (el.hasAttribute('data-is-range-filter')) {

                        const sliderEl = el.parentNode.querySelector('.range-slider');

                        el.value = '';

                        if (sliderEl && sliderEl.noUiSlider) {

                            const rangeSliderMinTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-min-text]');
                            const rangeSliderMaxTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-max-text]');

                            sliderEl.noUiSlider.set([
                                parseInt(sliderEl.dataset.rangeSliderMinDefault, 10),
                                parseInt(sliderEl.dataset.rangeSliderMaxDefault, 10)
                            ]);

                            rangeSliderMinTextEl.innerHTML = sliderEl.dataset.rangeSliderMinDefault;
                            rangeSliderMaxTextEl.innerHTML = sliderEl.dataset.rangeSliderMaxDefault;
                        }
                    }
                });

                categoryFiltersFormEl.querySelectorAll('.input-mobile-'+el.value).forEach(el => {

                    if (el.type === 'checkbox' || el.type ==='radio') {

                        el.checked = false;

                    } else if (el.type === 'number') {

                        el.value = '';

                    } else if (el.hasAttribute('data-is-range-filter')) {

                        const sliderEl = el.parentNode.querySelector('.range-slider');

                        el.value = '';

                        if (sliderEl && sliderEl.noUiSlider) {

                            const rangeSliderMinTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-min-text]');
                            const rangeSliderMaxTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-max-text]');

                            sliderEl.noUiSlider.set([
                                parseInt(sliderEl.dataset.rangeSliderMinDefault, 10),
                                parseInt(sliderEl.dataset.rangeSliderMaxDefault, 10)
                            ]);

                            rangeSliderMinTextEl.innerHTML = sliderEl.dataset.rangeSliderMinDefault;
                            rangeSliderMaxTextEl.innerHTML = sliderEl.dataset.rangeSliderMaxDefault;
                        }
                    }
                });

                $categoryFiltersFormEl.submit();
            })});

            if (categoryResetFiltersEl) {

                categoryResetFiltersEl.addEventListener('click', e => {

                    if (isProcessing) {
                        return;
                    }

                    categoryFilterInputEls.forEach(el => {

                        if (el.type === 'checkbox' || el.type ==='radio') {

                            el.checked = false;

                        } else if (el.type === 'number') {

                            el.value = '';

                        } else if (el.hasAttribute('data-is-range-filter')) {

                            const sliderEl = el.parentNode.querySelector('.range-slider');

                            el.value = '';

                            if (sliderEl && sliderEl.noUiSlider) {

                                const rangeSliderMinTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-min-text]');
                                const rangeSliderMaxTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-max-text]');

                                sliderEl.noUiSlider.set([
                                    parseInt(sliderEl.dataset.rangeSliderMinDefault, 10),
                                    parseInt(sliderEl.dataset.rangeSliderMaxDefault, 10)
                                ]);

                                rangeSliderMinTextEl.innerHTML = sliderEl.dataset.rangeSliderMinDefault;
                                rangeSliderMaxTextEl.innerHTML = sliderEl.dataset.rangeSliderMaxDefault;
                            }
                        }
                    });

                    $categoryFiltersFormEl.submit();
                });
            }
        };

        if (categoryFiltersFormEl) {

            categoryRangeSliderEls.forEach(el => {

                const opts = el.dataset;
                const rangeSliderContainerEl = el.parentNode;
                const rangeFilterEl = rangeSliderContainerEl.parentNode;
                const rangeSliderMinTextEl = rangeFilterEl.querySelector('[data-range-slider-min-text]');
                const rangeSliderMaxTextEl = rangeFilterEl.querySelector('[data-range-slider-max-text]');
                const rangeSliderMinInputEl = rangeSliderContainerEl.querySelector('input[name="'+opts.rangeSliderMinName+'"]');
                const rangeSliderMaxInputEl = rangeSliderContainerEl.querySelector('input[name="'+opts.rangeSliderMaxName+'"]');
                const rangeSlider = noUiSlider.create(el, {
                    start: [
                        parseInt(opts.rangeSliderMinDefault, 10),
                        parseInt(opts.rangeSliderMaxDefault, 10)
                    ],
                    connect: true,
                    range: {
                        'min': parseInt(opts.rangeSliderMinValue, 10),
                        'max': parseInt(opts.rangeSliderMaxValue, 10)
                    },
                    pips: {
                        mode: 'steps',
                        density: 3
                    }
                });

                let initialized = false;

                rangeSlider.on('update', debounce((values, handle) => {

                   if (initialized) {

                       const value = parseInt(values[handle], 10);

                       if (handle === 0) {

                           rangeSliderMinInputEl.value = parseInt(opts.rangeSliderMinValue, 10) !== value ? value : '';
                           rangeSliderMinTextEl.innerHTML = value;
                           rangeSliderMinInputEl.dispatchEvent(new Event('input', { bubbles:true }));

                       } else {

                           rangeSliderMaxInputEl.value = parseInt(opts.rangeSliderMaxValue, 10) !== value ? value : '';
                           rangeSliderMaxTextEl.innerHTML = value;
                           rangeSliderMaxInputEl.dispatchEvent(new Event('input', { bubbles:true }));
                       }

                   } else {

                       initialized = true;
                   }

                }, 500, false));

                rangeSliderContainerEl.classList.add('has-pips');
            });

            categoryFilterInputEls.forEach(el => { el.addEventListener('input', e => {

                if (isProcessing) {
                    return;
                }

                $categoryFiltersFormEl.submit();
            })});

            $categoryFiltersFormEl.on('submit', (e) => {

                e.preventDefault();

                const pageUrl = new URL(window.location);
                const pageId = pageUrl.searchParams.get('page');
                const sortBy = pageUrl.searchParams.get('sort-by');
                const formData = new FormData(categoryFiltersFormEl);
                let searchParams = new URLSearchParams(formData)

                if (pageId) {
                    searchParams.append('page', pageId);
                }

                if (sortBy) {
                    searchParams.append('sort-by', sortBy);
                }

                const url = `${window.location.pathname}?${searchParams.toString()}`;

                renderDynamicContent(url);
            });

            categoryFiltersFormEl.querySelectorAll('.dropdown-menu').forEach(el => { el.addEventListener('click', e => {
                e.stopPropagation();
            })});

            // Mobile filters menu
            const filtersMobileNavigationContainerEl = containerEl.querySelector('.filters-mobile-navigation-container');
            const filtersMobileNavigationShowEls = containerEl.querySelectorAll('[name="filters-mobile-navigation-show"]');
            const filtersMobileNavigationHideEls = containerEl.querySelectorAll('[name="filters-mobile-navigation-hide"]');

            filtersMobileNavigationShowEls.forEach(el => { el.addEventListener('click', (e) => {

                filtersMobileNavigationContainerEl.classList.add('filters-mobile-navigation-visible');
                filtersMobileNavigationContainerEl.classList.add('filters-mobile-navigation-active');

                document.body.classList.add('disable-scroll');
            })});

            filtersMobileNavigationHideEls.forEach(el => { el.addEventListener('click', (e) => {

                filtersMobileNavigationContainerEl.classList.remove('filters-mobile-navigation-active');

                document.body.classList.remove('disable-scroll');
            })});

            filtersMobileNavigationContainerEl.addEventListener('transitionend', e => {

                e.preventDefault();

                if (!filtersMobileNavigationContainerEl.classList.contains('filters-mobile-navigation-active')) {
                    filtersMobileNavigationContainerEl.classList.remove('filters-mobile-navigation-visible');
                }
            });
        }

    	if (categorySubcategoriesEl && categorySubcategoriesEl.classList.contains('category-tags')) {

    		new Swiper(categorySubcategoriesEl.querySelector('.swiper'), {
                modules: [
                    Navigation,
                    FreeMode
                ],
                spaceBetween: 8,
                slidesPerView: 'auto',
                freeMode: {
                    enabled: true,
                    minimumVelocity: 0.2,
                    momentum: false
                },
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
			});

    	} else if (categorySubcategoriesEl && categorySubcategoriesEl.classList.contains('category-images')) {

            new Swiper(categorySubcategoriesEl.querySelector('.swiper'), {
                modules: [
                    Navigation
                ],
                spaceBetween: 20,
                slidesPerView: 3,
                slidesPerGroup: 3,
                grabCursor: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    500: {
                        slidesPerView: 4,
                        slidesPerGroup: 4
                    },
                    700: {
                        slidesPerView: 5,
                        slidesPerGroup: 5
                    },
                    992: {
                        slidesPerView: 7,
                        slidesPerGroup: 7
                    },
                    1200: {
                        slidesPerView: 10,
                        slidesPerGroup: 10
                    }
                }
            });
        }

        bindEvents();
	},
    initCatalog: function() {

        const containerEl = document.querySelector('.section-catalog');
        const catalogSubcategoriesEl = containerEl.querySelector('.catalog-subcategories');
        let catalogFiltersFormEl = null;

        if (window.innerWidth < 992) {
            catalogFiltersFormEl = containerEl.querySelector('.filters-mobile-navigation-container .catalog-filters');
        } else {
            catalogFiltersFormEl = containerEl.querySelector('.catalog-filters');
        }

        const $catalogFiltersFormEl = $(catalogFiltersFormEl);
        const catalogRangeSliderEls = containerEl.querySelectorAll('.range-slider');
        const catalogFilterInputEls = containerEl.querySelectorAll('input');
        const facetResultCountEls = containerEl.querySelectorAll('[data-facet-result-count]');
        const filtersMobileNavigationCtaEl = containerEl.querySelector('.filters-mobile-navigation-container .filters-mobile-navigation-footer-inner-cta');
        let catalogDynamicContentEl = containerEl.querySelector('.catalog-dynamic-content');
        let isProcessing = false;

        const renderDynamicContent = (url, scrollTop = false) => {

            const xhr = new XMLHttpRequest();

            isProcessing = true;

            catalogRangeSliderEls.forEach(el => {
                el.removeAttribute('disabled');
            });

            catalogFilterInputEls.forEach(el => {
                el.disabled = true;
            });

            catalogDynamicContentEl.querySelectorAll('.sort-by-action').forEach(el => {
                el.disabled = true;
            });

            catalogDynamicContentEl.querySelector('.paginate-item-previous').disabled = true;
            catalogDynamicContentEl.querySelector('.paginate-item-next').disabled = true;

            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {

                if (xhr.readyState === 4) {

                    const dom = new DOMParser().parseFromString(xhr.responseText, 'text/html');
                    const newcatalogDynamicContent = dom.querySelector('.section-catalog .catalog-dynamic-content');
                    const itemCount = dom.querySelector('[data-catalog-items-count]').getAttribute('data-catalog-items-count');

                    facetResultCountEls.forEach(el => {
                        el.innerText = dom.querySelector('[data-facet-result-count="'+el.dataset.facetResultCount+'"]').innerText;
                    });

                    if (itemCount == 1) {

                        filtersMobileNavigationCtaEl.innerText = window.themeApp.utils.t('filters.show_result', {
                            amount: itemCount
                        });

                    } else {

                        filtersMobileNavigationCtaEl.innerText = window.themeApp.utils.t('filters.show_result_plural', {
                            amount: itemCount
                        });
                    }

                    catalogDynamicContentEl.replaceWith(newcatalogDynamicContent);
                    catalogDynamicContentEl = newcatalogDynamicContent;

                    if (history.pushState) {
                        window.history.pushState({path:url},'',url);
                    }

                    isProcessing = false;

                    catalogRangeSliderEls.forEach(el => {
                        el.removeAttribute('disabled');
                    });

                    catalogFilterInputEls.forEach(el => {
                        el.disabled = false;
                    });

                    catalogDynamicContentEl.querySelectorAll('.sort-by-action').forEach(el => {
                        el.disabled = false;
                    });

                    catalogDynamicContentEl.querySelector('.paginate-item-previous').disabled = false;
                    catalogDynamicContentEl.querySelector('.paginate-item-next').disabled = false;

                    if (scrollTop) {
                        document.body.scrollTop = containerEl.offsetTop;
                        document.documentElement.scrollTop = containerEl.offsetTop;
                    }

                    bindEvents();
                }
            };

            xhr.send();
        };

        const bindEvents = () => {

            const catalogResetFiltersEl = catalogDynamicContentEl.querySelector('.catalog-reset-filters');

            containerEl.querySelectorAll('.sort-by-action').forEach(el => { el.addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                const url = new URL(window.location);

                url.searchParams.set('sort-by', e.target.value);

                renderDynamicContent(url.href);
            })});

            containerEl.querySelector('.paginate-item-previous').addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                e.preventDefault();

                if (e.target.hasAttribute('href')) {
                    renderDynamicContent(e.target.getAttribute('href'), true);
                }
            });

            containerEl.querySelector('.paginate-item-next').addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                e.preventDefault();

                if (e.target.hasAttribute('href')) {
                    renderDynamicContent(e.target.getAttribute('href'), true);
                }
            });

            catalogDynamicContentEl.querySelectorAll('.catalog-remove-filter').forEach(el => { el.addEventListener('click', e => {

                if (isProcessing) {
                    return;
                }

                catalogFiltersFormEl.querySelectorAll('.input-'+el.value).forEach(el => {

                    if (el.type === 'checkbox' || el.type ==='radio') {

                        el.checked = false;

                    } else if (el.type === 'number') {

                        el.value = '';

                    } else if (el.hasAttribute('data-is-range-filter')) {

                        const sliderEl = el.parentNode.querySelector('.range-slider');

                        el.value = '';

                        if (sliderEl && sliderEl.noUiSlider) {

                            const rangeSliderMinTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-min-text]');
                            const rangeSliderMaxTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-max-text]');

                            sliderEl.noUiSlider.set([
                                parseInt(sliderEl.dataset.rangeSliderMinDefault, 10),
                                parseInt(sliderEl.dataset.rangeSliderMaxDefault, 10)
                            ]);

                            rangeSliderMinTextEl.innerHTML = sliderEl.dataset.rangeSliderMinDefault;
                            rangeSliderMaxTextEl.innerHTML = sliderEl.dataset.rangeSliderMaxDefault;
                        }
                    }
                });

                catalogFiltersFormEl.querySelectorAll('.input-mobile-'+el.value).forEach(el => {

                    if (el.type === 'checkbox' || el.type ==='radio') {

                        el.checked = false;

                    } else if (el.type === 'number') {

                        el.value = '';

                    } else if (el.hasAttribute('data-is-range-filter')) {

                        const sliderEl = el.parentNode.querySelector('.range-slider');

                        el.value = '';

                        if (sliderEl && sliderEl.noUiSlider) {

                            const rangeSliderMinTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-min-text]');
                            const rangeSliderMaxTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-max-text]');

                            sliderEl.noUiSlider.set([
                                parseInt(sliderEl.dataset.rangeSliderMinDefault, 10),
                                parseInt(sliderEl.dataset.rangeSliderMaxDefault, 10)
                            ]);

                            rangeSliderMinTextEl.innerHTML = sliderEl.dataset.rangeSliderMinDefault;
                            rangeSliderMaxTextEl.innerHTML = sliderEl.dataset.rangeSliderMaxDefault;
                        }
                    }
                });

                $catalogFiltersFormEl.submit();
            })});

            if (catalogResetFiltersEl) {

                catalogResetFiltersEl.addEventListener('click', e => {

                    if (isProcessing) {
                        return;
                    }

                    catalogFilterInputEls.forEach(el => {

                        if (el.type === 'checkbox' || el.type ==='radio') {

                            el.checked = false;

                        } else if (el.type === 'number') {

                            el.value = '';

                        } else if (el.hasAttribute('data-is-range-filter')) {

                            const sliderEl = el.parentNode.querySelector('.range-slider');

                            el.value = '';

                            if (sliderEl && sliderEl.noUiSlider) {

                                const rangeSliderMinTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-min-text]');
                                const rangeSliderMaxTextEl = el.parentNode.parentNode.querySelector('[ data-range-slider-max-text]');

                                sliderEl.noUiSlider.set([
                                    parseInt(sliderEl.dataset.rangeSliderMinDefault, 10),
                                    parseInt(sliderEl.dataset.rangeSliderMaxDefault, 10)
                                ]);

                                rangeSliderMinTextEl.innerHTML = sliderEl.dataset.rangeSliderMinDefault;
                                rangeSliderMaxTextEl.innerHTML = sliderEl.dataset.rangeSliderMaxDefault;
                            }
                        }
                    });

                    $catalogFiltersFormEl.submit();
                });
            }
        };

        if (catalogFiltersFormEl) {

            catalogRangeSliderEls.forEach(el => {

                const opts = el.dataset;
                const rangeSliderContainerEl = el.parentNode;
                const rangeFilterEl = rangeSliderContainerEl.parentNode;
                const rangeSliderMinTextEl = rangeFilterEl.querySelector('[ data-range-slider-min-text]');
                const rangeSliderMaxTextEl = rangeFilterEl.querySelector('[ data-range-slider-max-text]');
                const rangeSliderMinInputEl = rangeSliderContainerEl.querySelector('input[name="'+opts.rangeSliderMinName+'"]');
                const rangeSliderMaxInputEl = rangeSliderContainerEl.querySelector('input[name="'+opts.rangeSliderMaxName+'"]');
                const rangeSlider = noUiSlider.create(el, {
                    start: [
                        parseInt(opts.rangeSliderMinDefault, 10),
                        parseInt(opts.rangeSliderMaxDefault, 10)
                    ],
                    connect: true,
                    range: {
                        'min': parseInt(opts.rangeSliderMinValue, 10),
                        'max': parseInt(opts.rangeSliderMaxValue, 10)
                    },
                    pips: {
                        mode: 'steps',
                        density: 3
                    }
                });

                let initialized = false;

                rangeSlider.on('update', debounce((values, handle) => {

                   if (initialized) {

                       const value = parseInt(values[handle], 10);

                       if (handle === 0) {

                           rangeSliderMinInputEl.value = value;
                           rangeSliderMinTextEl.innerHTML = value;
                           rangeSliderMinInputEl.dispatchEvent(new Event('input', { bubbles:true }));

                       } else {

                           rangeSliderMaxInputEl.value = value;
                           rangeSliderMaxTextEl.innerHTML = value;
                           rangeSliderMaxInputEl.dispatchEvent(new Event('input', { bubbles:true }));
                       }

                   } else {

                       initialized = true;
                   }

                }, 500, false));

                rangeSliderContainerEl.classList.add('has-pips');
            });

            catalogFilterInputEls.forEach(el => { el.addEventListener('input', e => {

                if (isProcessing) {
                    return;
                }

                $catalogFiltersFormEl.submit();
            })});

            $catalogFiltersFormEl.on('submit', (e) => {

                e.preventDefault();

                const pageUrl = new URL(window.location);
                const pageId = pageUrl.searchParams.get('page');
                const sortBy = pageUrl.searchParams.get('sort-by');
                const formData = new FormData(catalogFiltersFormEl);
                let searchParams = new URLSearchParams(formData)

                if (pageId) {
                    searchParams.append('page', pageId);
                }

                if (sortBy) {
                    searchParams.append('sort-by', sortBy);
                }

                const url = `${window.location.pathname}?${searchParams.toString()}`;

                renderDynamicContent(url);
            });

            catalogFiltersFormEl.querySelectorAll('.dropdown-menu').forEach(el => { el.addEventListener('click', e => {
                e.stopPropagation();
            })});

            // Mobile filters menu
            const filtersMobileNavigationContainerEl = containerEl.querySelector('.filters-mobile-navigation-container');
            const filtersMobileNavigationShowEls = containerEl.querySelectorAll('[name="filters-mobile-navigation-show"]');
            const filtersMobileNavigationHideEls = containerEl.querySelectorAll('[name="filters-mobile-navigation-hide"]');

            filtersMobileNavigationShowEls.forEach(el => { el.addEventListener('click', (e) => {

                filtersMobileNavigationContainerEl.classList.add('filters-mobile-navigation-visible');
                filtersMobileNavigationContainerEl.classList.add('filters-mobile-navigation-active');

                document.body.classList.add('disable-scroll');
            })});

            filtersMobileNavigationHideEls.forEach(el => { el.addEventListener('click', (e) => {

                filtersMobileNavigationContainerEl.classList.remove('filters-mobile-navigation-active');

                document.body.classList.remove('disable-scroll');
            })});

            filtersMobileNavigationContainerEl.addEventListener('transitionend', e => {

                e.preventDefault();

                if (!filtersMobileNavigationContainerEl.classList.contains('filters-mobile-navigation-active')) {
                    filtersMobileNavigationContainerEl.classList.remove('filters-mobile-navigation-visible');
                }
            });
        }

        if (catalogSubcategoriesEl && catalogSubcategoriesEl.classList.contains('catalog-tags')) {

            new Swiper(catalogSubcategoriesEl.querySelector('.swiper'), {
                modules: [
                    Navigation,
                    FreeMode
                ],
                spaceBetween: 8,
                slidesPerView: 'auto',
                freeMode: {
                    enabled: true,
                    minimumVelocity: 0.2,
                    momentum: false
                },
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            });

        } else if (catalogSubcategoriesEl && catalogSubcategoriesEl.classList.contains('catalog-images')) {

            new Swiper(catalogSubcategoriesEl.querySelector('.swiper'), {
                modules: [
                    Navigation
                ],
                spaceBetween: 20,
                slidesPerView: 3,
                slidesPerGroup: 3,
                grabCursor: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    500: {
                        slidesPerView: 4,
                        slidesPerGroup: 4
                    },
                    700: {
                        slidesPerView: 5,
                        slidesPerGroup: 5
                    },
                    992: {
                        slidesPerView: 7,
                        slidesPerGroup: 7
                    },
                    1200: {
                        slidesPerView: 10,
                        slidesPerGroup: 10
                    }
                }
            });
        }

        bindEvents();
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

        const isWishlistTemplate = document.querySelector('body').classList.contains('template-customers-wishlist');

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

                    themeApp.utils.animate(el.parentNode, 'bounce');

                    el.innerHTML = value;
                });

                if (iconEl) {
                    themeApp.utils.animate(iconEl, 'pulse');
                }

                document.dispatchEvent(new CustomEvent('theme:wishlist:addItem', {
                    detail: {
                        id: id
                    }
                }));
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

                    themeApp.utils.animate(el.parentNode, 'bounce');

                    el.innerHTML = value;
                });

                if (iconEl) {
                    themeApp.utils.animate(iconEl, 'pulse');
                }

                if (itemEl) {

                	itemEl.remove();

                    if (isWishlistTemplate && document.querySelectorAll('[data-wishlist-item]').length < 1) {
                        document.querySelector('.section-wishlist .section-content > .container').innerHTML = themeApp.utils.t('general.wishlist_empty');
                    }
                }

                document.dispatchEvent(new CustomEvent('theme:wishlist:removeItem', {
                    detail: {
                        id: id
                    }
                }));
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

                        if (isWishlistTemplate && document.querySelectorAll('[data-wishlist-item]').length < 1) {
                            document.querySelector('.section-wishlist .section-content > .container').innerHTML = themeApp.utils.t('general.wishlist_empty');
                        }

                        return;
	                }

                    itemCountEls.forEach(el => {

                        const value = (parseInt(el.innerText) || 0) - 1;

                        if (value < 0) {
                            return;
                        }

                        if (value < 1 && el.parentNode.classList.contains('has-items')) {
                            el.parentNode.classList.remove('has-items');
                        }

                        themeApp.utils.animate(el.parentNode, 'bounce');

                        el.innerHTML = value;
                    });

                    if (iconEl) {
                        themeApp.utils.animate(iconEl, 'pulse');
                    }

	                el.setAttribute('aria-pressed', false);

                    document.dispatchEvent(new CustomEvent('theme:wishlist:removeItem', {
                        detail: {
                            id: id
                        }
                    }));
	            });

    		} else {

    			$.post('/api/wishlist/products/'+id, () => {

                    itemCountEls.forEach(el => {

                        const value = (parseInt(el.innerText) || 0) + 1;

                        if (value > 0 && !el.parentNode.classList.contains('has-items')) {
                            el.parentNode.classList.add('has-items');
                        }

                        themeApp.utils.animate(el.parentNode, 'bounce');

                        el.innerHTML = value;
                    });

                    if (iconEl) {
                        themeApp.utils.animate(iconEl, 'pulse');
                    }

	                el.setAttribute('aria-pressed', true);

                    document.dispatchEvent(new CustomEvent('theme:wishlist:addItem', {
                        detail: {
                            id: id
                        }
                    }));
	            });
    		}
    	})});
	},
    initProduct: function() {

        const containerEl = document.querySelector('.section-product-card');
        let productThumbMediaSwiper = null;
        let productMainMediaSwiper = null;

    	const initProductMedia = () => {

    		const productThumbMediaSwiperEl = containerEl.querySelector('#product-thumb-media-swiper');
            let productMainMediaSwiperEl = containerEl.querySelector('#product-main-media-swiper');

    		const productThumbMediaSwiperCfg = {
                modules: [
                    Navigation,
                    FreeMode,
                    Thumbs,
                    Mousewheel
                ],
    			direction: 'vertical',
				spaceBetween: 16,
				slidesPerView: 'auto',
                freeMode: {
                    enabled: true,
                    minimumVelocity: 0.2,
                    momentum: false
                },
				watchSlidesProgress: true,
                mousewheel: {
                    releaseOnEdges: true,
                },
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}
			};

            productThumbMediaSwiperEl.style.height = productMainMediaSwiperEl.getBoundingClientRect().height+'px';

            productThumbMediaSwiper = new Swiper(productThumbMediaSwiperEl, productThumbMediaSwiperCfg);

            const productMainMediaSwiperCfg = {
                modules: [
                    Navigation,
                    Thumbs
                ],
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

			productMainMediaSwiper = new Swiper(productMainMediaSwiperEl, productMainMediaSwiperCfg);
            const productImageEls = productMainMediaSwiperEl.querySelectorAll('.lazy');

            // Preload product images so those are available when customer clicks thumb
            if (productImageEls.length > 0) {

                productImageEls.forEach((el, index) => {

                    LazyLoad.load(el, {
                        show_while_loading: true,
                        callback_loading: function (el) {

                            picturefill({
                                elements: [el]
                            });

                            objectFitImages(el);
                        },
                        callback_error: function (el) {

                            picturefill({
                                elements: [el]
                            });

                            objectFitImages(el);
                        }
                    });
                });
            }

            if (window.themeApp.data.designMode !== 'edit') {
			    const productMediaGallery = new Gallery(productMainMediaSwiperEl);
            }

            const productThumbEls = productThumbMediaSwiperEl.querySelectorAll('.swiper-slide');

            productThumbEls.forEach((el, index) => { el.addEventListener('mouseover', e => {
                productMainMediaSwiper.slideTo(index, 0, true);
            })});

            window.addEventListener('resize', debounce(() => {
                productMainMediaSwiperEl = containerEl.querySelector('#product-main-media-swiper');
                productThumbMediaSwiperEl.style.height = productMainMediaSwiperEl.getBoundingClientRect().height+'px';
            }, 150, false));
    	};

    	const initProductAttributes = () => {

    		const productId = containerEl.querySelector('[name="product_id"]').value;

    		// If attribute is visible show it
            $('.product-attribute[data-is-usable]').filter(':visible').each(function() {
                $(this).removeAttr('disabled');
            });

            // Attributes product price total option
            $('.product-attribute.has-price, option.has-price').each(function() {

                if ($(this).is('option')) {

                    $(this).each(function() {

                        const self = this;
                        const attributeId = $(this).val();

                        $.get('/api/products/'+productId+'/price?attributes['+attributeId+']=true', (res) => {

                            const price = themeApp.data.taxFreePrices ? res.net_price : res.price;

                        	$(self).append('('+themeApp.utils.formatCurrency(price)+')');
                        });
                    });

                } else if ($(this).is(':checkbox, :radio')) {

                    const self = this;
                    const attributeId = $(this).val();

                    $.get('/api/products/'+productId+'/price?attributes['+attributeId+']=true', (res) => {

                        const price = themeApp.data.taxFreePrices ? res.net_price : res.price;

                    	$(self).siblings('label').append('('+themeApp.utils.formatCurrency(price)+')');
                    });

                } else if ($(this).is('textarea')) {

                	const self = this;
                    const attributeId = $(this).attr('name');

                    $.get('/api/products/'+productId+'/price?attributes['+attributeId+']=true', (res) => {

                        const price = themeApp.data.taxFreePrices ? res.net_price : res.price;

                    	$(self).siblings('label').append('('+themeApp.utils.formatCurrency(price)+')');
                    });
                }
            });

            $('.product-attribute').on('change', function() {

                const attributeId = $(this).data('attribute');
                const optionId = $(this).val();
                const hasImage = this.hasAttribute('data-has-image');
                let sibling = $(this).parentsUntil('.product-attribute-container').parent().siblings('.product-subattribute-container[data-attribute="'+attributeId+'"]');
                let productAttributes = [];

                if (!sibling.length) {
                    sibling = $(this).parent().siblings('.product-subattribute-container[data-attribute="'+attributeId+'"]');
                }

                if ($(this).is(':checkbox')) {

                    sibling = $(this).parentsUntil('.product-attribute-container').parent().siblings('.product-subattribute-container[data-option="'+optionId+'"]');

                    if (!sibling.length) {
                        sibling = $(this).parent().siblings('.product-subattribute-container[data-option="'+optionId+'"]');
                    }
                }

                sibling.hide();
                sibling.find('textarea').val('');
                sibling.find('.product-attribute').attr('disabled', true);

                // Reset subattributes if hidden
                $('.product-subattribute-container').filter(':hidden').each(function() {

                    $(this).find('.product-attribute').each(function() {

                        if ($(this).is(':checkbox, :radio')) {
                            $(this).prop('checked', false);
                        }

                        if ($(this).is('select')) {
                            $(this).prop('selectedIndex', 0);
                        }
                    });
                });

                // Change image on radio select
                if (hasImage && productMainMediaSwiper) {

                    const el = document.querySelector('#product-main-media-swiper .swiper-slide[data-product-option-image="'+optionId+'"]');
                    const index = [...el.parentElement.children].indexOf(el);

                    productMainMediaSwiper.slideTo(index, 0, true);
                }

                // Show attributes if active
                if (($(this).is('select') && $(this).val()) || ($(this).is(':checkbox, :radio') && $(this).is(':checked')) || ($(this).is('textarea') && $(this).val())) {

                    $('[data-option="'+optionId+'"]').show();
                    $('[data-option="'+optionId+'"]').find('[data-is-usable]').removeAttr('disabled');
                }

                // Get attributes prices
                $('.product-attribute').each(function() {

                    if ($(this).is('select') && $(this).val()) {

                        productAttributes.push('attributes['+$(this).val()+']');

                    } else if ($(this).is(':checkbox, :radio') && $(this).is(':checked')) {

                        productAttributes.push('attributes['+$(this).val()+']');

                    } else if ($(this).is('textarea') && $(this).val()) {

                        productAttributes.push('attributes['+$(this).attr('name')+']');
                    }
                });

                // Get jsons and change prices
                $.get('/api/products/'+productId+'/price?'+productAttributes.join('&')+'=true', (res) => {

                    const price = themeApp.data.taxFreePrices ? res.net_price : res.price;
                    const originalPrice = themeApp.data.taxFreePrices ? res.original_net_price : res.original_price;

                    $('[data-product-price-dynamic]').html(themeApp.utils.formatCurrency(price));

                    if ($('[data-product-original-price-dynamic]').length) {
                        $('[data-product-original-price-dynamic]').html(themeApp.utils.formatCurrency(originalPrice));
                    }

                    if (window.themeApp.data.klarnaPlacementsClientId && window.KlarnaOnsiteService) {

                        containerEl.querySelectorAll('klarna-placement[data-purchase-amount]').forEach(el => {
                            el.setAttribute('data-purchase-amount', price);
                        });

                        window.KlarnaOnsiteService.push({ eventName: 'refresh-placements' });
                    }
                });
            });
    	};

    	const initProductReviews = () => {

    		const productReviewFormEl = containerEl.querySelector('.product-review-form');
    		const productReviewCreateEl = containerEl.querySelector('#product-review-create');
    		const productReviewCancelEl = containerEl.querySelector('#product-review-cancel');
    		const productShowReviewsEl = containerEl.querySelector('#product-show-reviews');
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

        const initProductQuantity = () => {

            const productQuantityInputEl = containerEl.querySelector('.product-quantity-input');
            const productQuantityDecreaseEl = containerEl.querySelector('.product-quantity-decrease');
            const productQuantityIncreaseEl = containerEl.querySelector('.product-quantity-increase');
            const minQuantity = productQuantityInputEl.getAttribute('min');
            const maxQuantity = productQuantityInputEl.getAttribute('max');

            productQuantityDecreaseEl.addEventListener('click', (e) => {

                const currentValue = parseInt(productQuantityInputEl.value, 10);

                if (currentValue !== parseInt(minQuantity, 10)) {
                    productQuantityInputEl.value = currentValue - 1;
                }
            });

            productQuantityIncreaseEl.addEventListener('click', (e) => {

                const currentValue = parseInt(productQuantityInputEl.value, 10);

                if (maxQuantity === null || (maxQuantity && currentValue !== parseInt(maxQuantity, 10))) {
                    productQuantityInputEl.value = currentValue + 1;
                }
            });

            themeApp.utils.filterInput(productQuantityInputEl, function (value) {

                if (minQuantity && maxQuantity) {

                    return (
                        value != 0 &&
                        value >= parseInt(minQuantity, 10) &&
                        value <= parseInt(maxQuantity, 10) &&
                        /^\d+$/.test(value)
                    );

                } else if (minQuantity) {

                    return (
                        value != 0 &&
                        value >= parseInt(minQuantity, 10) &&
                        /^\d+$/.test(value)
                    );

                } else if (maxQuantity) { 

                    return (
                        value != 0 &&
                        value <= parseInt(maxQuantity, 10) &&
                        /^\d+$/.test(value)
                    );

                } else {

                    return (
                        value != 0 &&
                        /^\d+$/.test(value)
                    );
                }
            });
        };

        if (containerEl.querySelector('.product-media-container')) {
            initProductMedia();
        }

        if (containerEl.querySelector('.product-reviews')) {
            initProductReviews();
        }

        if (containerEl.querySelector('.product-attributes')) {
            initProductAttributes();
        }

        if (containerEl.querySelector('.product-quantity')) {
            initProductQuantity();
        }
    },
    initCookiePolicy: function() {

        const cookiePolicyEl = document.querySelector('.cookie-policy');

        if (!cookiePolicyEl) {
            return;
        }

        if (themeApp.data.cookiePolicy === null) {
            document.body.classList.add('cookie-policy-visible');
        }

        const cookiePolicyCloseEl = cookiePolicyEl.querySelector('[data-cookie-policy-close]');
        const cookiePolicyOpenEls = document.querySelectorAll('[data-cookie-policy-open]');
        const cookiePolicySubmitEls = cookiePolicyEl.querySelectorAll('[data-cookie-policy-submit]');
        const cookiePolicyFormEl = cookiePolicyEl.querySelector('#cookie-policy-form');
        const cookiePolicyInputEl = cookiePolicyFormEl.querySelector('[name="cookie_policy"]');

        if (cookiePolicyCloseEl) {

            cookiePolicyCloseEl.addEventListener('click', (e) => {

                document.body.classList.remove('cookie-policy-visible');
                cookiePolicyEl.classList.add('d-none');
            });
        }

        if (cookiePolicyOpenEls.length > 0) {

            cookiePolicyOpenEls.forEach(el => { el.addEventListener('click', e => {

                if (document.body.classList.contains('cookie-policy-visible')) {
                    return;
                }

                cookiePolicyEl.classList.remove('d-none');
                document.body.classList.add('cookie-policy-visible');
            })});
        }

        if (cookiePolicySubmitEls.length > 0) {

            cookiePolicySubmitEls.forEach(el => { el.addEventListener('click', e => {

               cookiePolicyInputEl.setAttribute('value', el.value);
               cookiePolicyFormEl.submit();
            })});
        }
    },
    initBackToTopButton: function() {

        const containerEl = document.body;
        const scrollingEl = document.scrollingElement;
        const $scrollingEl = $(scrollingEl);
        let windowHeight = window.innerHeight;

        containerEl.insertAdjacentHTML('beforeend',`
            <button type="button" id="back-to-top-btn" class="d-none">
                <img src="${themeApp.data.routes.assetUrl+'/'+themeApp.icons.arrowUpRegular}" class="svg-inline svg-lazy" alt="">
            </button>
        `);

        const backToTopBtnEL = containerEl.querySelector('#back-to-top-btn');

        document.addEventListener('scroll', () => {

            if (document.activeElement !== containerEl && window.innerHeight === windowHeight) {

                document.activeElement.blur();

            } else {

                windowHeight = window.innerHeight;
            }

            if (scrollingEl.scrollTop >= 250 && backToTopBtnEL.classList.contains('d-none')) {

                backToTopBtnEL.classList.remove('d-none');

                themeApp.utils.animate(backToTopBtnEL, 'fadeIn');

            } else if (scrollingEl.scrollTop < 250 && !backToTopBtnEL.classList.contains('d-none')) {

                themeApp.utils.animate(backToTopBtnEL, 'fadeOut').then(() => {
                    backToTopBtnEL.classList.add('d-none');
                });
            }
        });

        backToTopBtnEL.addEventListener('click', () => {

            $scrollingEl.animate({
                scrollTop: 0
            }, 800);
        });
    },
    initLocalization: function() {

        const localizationFormEl = document.querySelector('#site-localization-form');
        const localeSelectEl = localizationFormEl.querySelector('.site-localization-locale-select');
        const currencySelectEl = localizationFormEl.querySelector('.site-localization-currency-select');

        if (localeSelectEl) {

            localeSelectEl.addEventListener('change', e => {
                localizationFormEl.submit();
            });
        }

        if (currencySelectEl) {

            currencySelectEl.addEventListener('change', e => {
                localizationFormEl.submit();
            });
        }
    }
}