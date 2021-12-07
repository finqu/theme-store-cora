import Swiper, { Navigation, Pagination, Autoplay, EffectFade, Parallax } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import { debounce } from './utils';

export default class ImageCarousel {

    constructor(el) {

        this.el = el;
        this.containerEl = el.querySelector('.swiper');
        this.opts = this.containerEl.dataset;
        this.swiperCfg = {
            modules: [
                Navigation,
                Pagination,
                Autoplay,
                EffectFade,
                Parallax
            ],
            loop: JSON.parse(this.opts.carouselLoop),
            speed: 1000,
            effect: this.opts.carouselEffect,
            watchSlidesProgress: true,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination'
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            on: {
                init: function() {

                    const swiper = this;
                    let delay = 200;

                    if (swiper.params.effect === 'fade') {
                        delay = 700;
                    }

                    if (swiper.el) {
                        setTimeout(() => {
                            swiper.el.classList.add('swiper-ready');
                            themeApp.utils.animate(swiper.el.querySelector('.swiper-slide-active .slide-content'), 'fadeIn');
                        }, delay);
                    }

                    if (swiper.params.parallax) {

                        for (let i = 0; i < swiper.slides.length; i++) {

                            const slideEl = swiper.slides[i];
                            const titleEl = slideEl.querySelector('.slide-title');
                            const descriptionEl = slideEl.querySelector('.slide-description');
                            const actionEl = slideEl.querySelector('.slide-action');

                            if (titleEl) {
                                titleEl.setAttribute('data-swiper-parallax', 0.75 * swiper.width);
                            }

                            if (descriptionEl) {
                                descriptionEl.setAttribute('data-swiper-parallax', 0.65 * swiper.width);
                            }

                            if (actionEl) {
                                actionEl.setAttribute('data-swiper-parallax', 0.6 * swiper.width);
                            }
                        }
                    }
                }
            }
        };

        if (this.opts.carouselAutoplay === 'true') {

            this.swiperCfg.autoplay = {
                delay: this.opts.carouselAutoplaySpeed ? parseInt(this.opts.carouselAutoplaySpeed, 10) * 1000 : 3000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false
            };

        } else {

            this.swiperCfg.autoplay = false;
        }

        if (this.opts.carouselEffect === 'fade') {

            this.swiperCfg.parallax = false;

        } else if (this.opts.carouselEffect === 'slide') {

            this.swiperCfg.parallax = true;
        }

        this.swiper = new Swiper(this.containerEl, this.swiperCfg);

        window.addEventListener('resize', debounce(() => {
            this.swiper.destroy();
            this.swiper = new Swiper(this.containerEl, this.swiperCfg);
        }, 150, false));

        document.addEventListener('finqu:section:unload', debounce((e) => {
            if (this.el === e.target) {
                this.swiper.destroy();
            }
        }, 250, false));
    }
}