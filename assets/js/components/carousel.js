import Swiper, { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import { debounce } from './utils';

export default class Carousel {

    constructor(el) {

        this.el = el;
        this.containerEl = el.querySelector('.swiper');
        this.opts = this.containerEl.dataset;

        const itemsPerView = JSON.parse(this.opts.carouselItemsPerView);

        this.swiperCfg = {
            modules: [
                Navigation,
                Pagination
            ],
            spaceBetween: 20,
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