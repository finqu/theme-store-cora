import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import { debounce } from './utils';

export default class Carousel {

    constructor(el) {

        this.el = el;
        this.containerEl = el.querySelector('.swiper');
        this.opts = this.containerEl.dataset;

        const itemsPerView = JSON.parse(this.opts.carouselItemsPerView);
        let spaceBetween = 20;

        switch(this.opts.carouselItemsGap) {

            case 'off':
                spaceBetween = 0;
                break;

            case 'sm':
                spaceBetween = 16;
                break;

            case 'md':
                spaceBetween = 20;
                break;

            case 'lg':
                spaceBetween = 24;
                break;

            case 'xl':
                spaceBetween = 32;
                break;
        }

        this.swiperCfg = {
            modules: [
                Navigation,
                Pagination
            ],
            spaceBetween: spaceBetween,
            slidesPerView: 2,
            slidesPerGroup: 2,
            grabCursor: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                500: {
                    slidesPerView: 3,
                    slidesPerGroup: 3
                },
                992: {
                    slidesPerView: itemsPerView,
                    slidesPerGroup: itemsPerView
                }
            }
        };

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