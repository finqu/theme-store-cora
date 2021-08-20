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
            effect: this.opts.carouselEffect,
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
                            .find('.slide-bg-img img')
                            .attr({
                                'data-swiper-parallax': 0.75 * swiper.width
                            });

                        $(swiper.slides[i])
                            .find('.slide-title')
                            .attr('data-swiper-parallax', 0.65 * swiper.width);

                        $(swiper.slides[i])
                            .find('.slide-description')
                            .attr('data-swiper-parallax', 0.5 * swiper.width);
                    }
                }
            }
        };

        if (this.opts.carouselAutoplay == true) {

            this.swiperCfg.autoplay = {
                delay: this.opts.carouselAutoplaySpeed ? this.opts.carouselAutoplaySpeed * 1000 : 3000,
                pauseOnMouseEnter: true
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

        window.addEventListener('resize', () => {
            this.swiper.destroy();
            this.swiper = new Swiper(this.containerEl, this.swiperCfg);
        });

        document.addEventListener('finqu:section:load', (e) => {
            if (e.target.classList.contains('section-image-carousel')) {
                this.containerEl = e.target.querySelector('.swiper-container');
                this.swiper = new Swiper(this.containerEl, this.swiperCfg);
            }
        });
    }
}