import Swiper from 'swiper';
import SwiperCore, { Navigation, Pagination } from 'swiper/core';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Pagination]);

export default class ImageCarousel {

    constructor(el) {

        this.el = el;
        this.swiperCfg = {
            speed: 1000,
            autoplay: true,
            parallax: true,
            loop: true,
            grabCursor: true,
            centerSlides: true,
            pagination: {
                el: '.swiper-pagination',
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
                            .find('.img-container')
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

        this.swiper = new Swiper(el.querySelector('.swiper-container'), this.swiperCfg);

        window.addEventListener('resize', () => {
            this.swiper.destroy();
            this.swiper = new Swiper(el.querySelector('.swiper-container'), this.swiperCfg);
        });

        console.log('Init image carousel');
    }
}