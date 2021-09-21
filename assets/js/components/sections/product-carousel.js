import Swiper from 'swiper';
import SwiperCore, {
    Navigation,
    Pagination
} from 'swiper/core';
import 'swiper/swiper.min.css';
import 'swiper/components/controller/controller.min.css';
import { debounce } from '../utils';

SwiperCore.use([
    Navigation
]);

export default class ProductCarousel {

    constructor(el) {

        this.el = el;
        this.containerEl = el.querySelector('.swiper-container');
        this.opts = this.containerEl.dataset;

        let itemsPerView = JSON.parse(this.opts.carouselItemsPerView);

        this.swiperCfg = {
            spaceBetween: 40,
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