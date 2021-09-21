import Swiper from 'swiper';
import SwiperCore, {
    Navigation,
    Pagination,
    Autoplay,
    EffectFade,
    Parallax
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/controller/controller.min.css';
import 'swiper/components/effect-fade/effect-fade.min.css';
import { debounce } from '../utils';

SwiperCore.use([
    Navigation,
    Parallax
]);

export default class ImageCarousel {

    constructor(el) {

        this.el = el;
        this.containerEl = el.querySelector('.swiper-container');
        this.opts = this.containerEl.dataset;
        this.swiperCfg = {
            loop: JSON.parse(this.opts.carouselLoop),
            speed: 1000,
            effect: this.opts.carouselEffect,
            watchSlidesProgress: true,
            parallax: true,
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

                    for (let i = 0; i < swiper.slides.length; i++) {

                        $(swiper.slides[i])
                            .find('.slide-title')
                            .attr('data-swiper-parallax', 0.75 * swiper.width);

                        $(swiper.slides[i])
                            .find('.slide-description')
                            .attr('data-swiper-parallax', 0.65 * swiper.width);

                        $(swiper.slides[i])
                            .find('.slide-action')
                            .attr('data-swiper-parallax', 0.5 * swiper.width);
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

            SwiperCore.use(Autoplay);

        } else {

            this.swiperCfg.autoplay = false;
        }

        if (this.opts.carouselEffect === 'fade') {

            this.swiperCfg.parallax = false;

            SwiperCore.use(EffectFade);
        }

        if (this.opts.carouselPagination) {
            SwiperCore.use(Pagination);
        }

        this.swiper = new Swiper(this.containerEl, this.swiperCfg);

        window.addEventListener('resize', debounce(() => {
            this.swiper.destroy();
            this.swiper = new Swiper(this.containerEl, this.swiperCfg);
        }, 150, false));

        document.addEventListener('finqu:section:unload', () => {
            this.swiper.destroy();
        });
    }
}