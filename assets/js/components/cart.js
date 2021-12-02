import $ from 'jquery';
import 'jquery-serializejson';
import Notify from './notify';

export default class Cart {

    constructor() {

        this.cart = {};
        this.items = {};
        this.queue = [];
        this.processing = false;
        this.initialized = false;
        this.notify = new Notify();
        this.cartTemplateEl = document.querySelector('#hbs-cart-template');
        this.cartMiniTemplateEl = document.querySelector('#hbs-cart-mini-template');
        this.cartTemplate = null;
        this.cartMiniTemplate = null;
    }

    // Init
    init() {

        this.taxFreePrices = themeApp.data.taxFreePrices;
        this.cartAddNotify = themeApp.data.cartAddNotify;
        this.cartUrl = themeApp.data.routes.cartUrl;
        this.checkoutUrl = themeApp.data.routes.checkoutUrl;
        this.assetUrl = themeApp.data.routes.assetUrl;
        this.aspectRatioProductImage = themeApp.data.aspectRatioProductImage;

        if (this.cartTemplateEl) {
            this.cartTemplate = themeApp.hbs.compile(this.cartTemplateEl.innerHTML);
        }

        if (this.cartMiniTemplateEl) {
            this.cartMiniTemplate = themeApp.hbs.compile(this.cartMiniTemplateEl.innerHTML);
        }

        this._bindEvents();
        this._getCart();
    }

    // Bind events
    _bindEvents() {

        const self = this;

        const add = function(e) {

            e.preventDefault();

            // Serialise form
            if (e.target.hasAttribute('data-cart-form')) {

                const cartFormVal = e.target.getAttribute('data-cart-form');
                let cartFormEl = null;

                if (cartFormVal) {

                    cartFormEl = document.querySelector(cartFormVal);

                } else {

                    cartFormEl = e.target.closest('form[name="product"]');
                }

                if (cartFormEl) {

                    e.preventDefault();

                    const data = $(cartFormEl).serializeJSON();
                    let itemId = e.target.getAttribute('data-cart-add');
                    let quantity = e.target.getAttribute('data-cart-quantity');
                    let attributes = [];

                    delete data['form_type'];
                    delete data['form_id'];

                    for (const key in data) {

                        if (key === 'product_id') {

                            itemId = data[key];

                        } else if (key === 'quantity') {

                            quantity = data[key];

                        } else {

                            attributes.push({
                                name: key,
                                value: data[key]
                            });
                        }
                    };

                    if (!itemId || !quantity) {
                        return false;
                    }

                    return self.addItem(parseInt(itemId, 10), parseInt(quantity, 10), attributes);
                }

                return false;


            // Basic add
            } else {

                const itemId = parseInt(e.target.getAttribute('data-cart-add'), 10);
                const quantity = parseInt(e.target.getAttribute('data-cart-quantity'), 10);

                return self.addItem(itemId, quantity);
            }
        }

        const remove = function(e) {

            e.preventDefault();

            return self.removeItem(e.target.getAttribute('data-cart-remove'));
        }

        const update = function(e) {

            e.preventDefault();

            const itemId = parseInt(e.target.getAttribute('data-cart-update'), 10);
            const quantity = parseInt(e.target.getAttribute('data-cart-quantity'), 10);

            return self.updateItem(itemId, quantity);
        }

        const quantityDynamic = function(e) {

            e.preventDefault();

            const itemId = parseInt(e.target.getAttribute('data-cart-quantity-dynamic'), 10);
            const quantity = parseInt(e.target.value, 10);

            if (!quantity || !Number.isInteger(quantity)) {
                return false;
            }

            return self.updateItem(itemId, quantity);
        }

        const quantityDecrease = function(e) {

            e.preventDefault();

            const itemId = parseInt(e.target.getAttribute('data-cart-quantity-decrease'), 10);
            const item = self.items.find(item => item.id === itemId);

            if (item) {
                return self.updateItem(item.id, item.quantity - 1);
            }

            return false;
        }

        const quantityIncrease = function(e) {

            e.preventDefault();

            const itemId = parseInt(e.target.getAttribute('data-cart-quantity-increase'), 10);
            const item = self.items.find(item => item.id === itemId);

            if (item) {
                return self.updateItem(item.id, item.quantity + 1);
            }

            return false;
        }

        const clear = function(e) {

            e.preventDefault();

            return self.clearItems();
        }

        const checkout = function(e) {

            document.dispatchEvent(new CustomEvent('theme:cart:initiateCheckout', {
                detail: self.cart
            }));
        }

        const render = function(e) {

            const cartContainerEl = document.querySelector('[data-cart-container]');
            const cartMiniContainerEl = document.querySelector('[data-cart-mini-container]');
            const itemCountEls = document.querySelectorAll('[data-cart-item-count]');
            const subtotalEls = document.querySelectorAll('[data-cart-subtotal]');
            const paymentFeeEls = document.querySelectorAll('[data-cart-payment-fee]');
            const shippingPriceEls = document.querySelectorAll('[data-cart-shipping-price]');
            const discountsEls = document.querySelectorAll('[data-cart-discounts]');
            const taxFreeEls = document.querySelectorAll('[data-cart-tax-free]');
            const taxEls = document.querySelectorAll('[data-cart-tax]');
            const totalEls = document.querySelectorAll('[data-cart-total]');

            itemCountEls.forEach(el => {

                if (self.cart.item_count > 0 && !el.parentNode.classList.contains('has-items')) {

                    el.parentNode.classList.add('has-items');

                } else if (self.cart.item_count < 1 && el.parentNode.classList.contains('has-items')) {

                    el.parentNode.classList.remove('has-items');
                }

                if (self.initialized) {
                    themeApp.animate(el.parentNode, 'bounce');
                }

                el.innerHTML = self.cart.item_count || 0;
            });

            subtotalEls.forEach(el => {
                el.innerHTML = self.cart.subtotal || 0;
            });

            paymentFeeEls.forEach(el => {
                el.innerHTML = self.cart.payment_fee || 0;
            });

            shippingPriceEls.forEach(el => {
                el.innerHTML = self.cart.shipping_price || 0;
            });

            if (discountsEls && self.cart.discounts) {

                discountsEls.forEach(el => {

                    el.innerHTML = `
                        <div class="cart-discount">
                            ${self.cart.discounts.map(item => `
                                <span class="cart-discount-title">${item.title}${item.code ? ' - '+item.code : ''}</span>
                                <span class="cart-discount-amount">${item.amount}</span>
                            `)}
                        </div>
                    `;
                });
            }

            taxFreeEls.forEach(el => {
                el.innerHTML = self.cart.tax_free || 0;
            });

            taxEls.forEach(el => {
                el.innerHTML = self.cart.tax || 0;
            });

            totalEls.forEach(el => {
                el.innerHTML = self.cart.total || 0;
            });

            if (cartContainerEl) {

                cartContainerEl.innerHTML = self.cartTemplate({
                    cart: self.cart,
                    itemCount: self.items.length,
                    assetUrl: self.assetUrl,
                    cartUrl: self.cartUrl,
                    checkoutUrl: self.checkoutUrl,
                    taxFreePrices: self.taxFreePrices,
                    aspectRatioProductImage: self.aspectRatioProductImage
                });

                cartContainerEl.querySelectorAll('[data-cart-quantity-dynamic]').forEach(el => {

                    themeApp.utils.filterInput(el, function(value) {
                        return value != 0 && /^\d+$/.test(value);
                    });

                    el.addEventListener('change', e => {
                        quantityDynamic(e);
                    })
                });
            }

            if (cartMiniContainerEl) {

                cartMiniContainerEl.innerHTML = self.cartMiniTemplate({
                    cart: self.cart,
                    itemCount: self.items.length,
                    assetUrl: self.assetUrl,
                    cartUrl: self.cartUrl,
                    checkoutUrl: self.checkoutUrl,
                    taxFreePrices: self.taxFreePrices,
                    aspectRatioProductImage: self.aspectRatioProductImage
                });
            }

            document.dispatchEvent(new CustomEvent('theme:cart:render'));
        }

        document.addEventListener('click', (e) => {

            if (e.target.hasAttribute('data-cart-add')) {
                add(e);
            }

            if (e.target.hasAttribute('data-cart-remove')) {
                remove(e);
            }

            if (e.target.hasAttribute('data-cart-update')) {
                update(e);
            }

            if (e.target.hasAttribute('data-cart-quantity-decrease')) {
                quantityDecrease(e);
            }

            if (e.target.hasAttribute('data-cart-quantity-increase')) {
                quantityIncrease(e);
            }

            if (e.target.hasAttribute('data-cart-clear')) {
                clear(e);
            }

            if (e.target.hasAttribute('data-cart-checkout')) {
                checkout(e);
            }
        });

        document.addEventListener('theme:cart:update', (e) => {

            render(e)

            if (!this.initialized) {
                this.initialized = true;
            }
        });
    }

    // Add request to queue
    _addToQueue(url = null, data = null, options = {}) {

        let request = {
            url: url,
            type: options.type || 'POST',
            dataType: options.dataType || 'json',
            success: options.success,
            error: options.error,
            complete: options.complete
        };

        if (data) {
            request.data = data;
        }

        if (request.dataType == 'json') {
            request.data = JSON.stringify(request.data);
            request.contentType = 'application/json; charset=utf-8';
        }

        this.queue.push(request);

        if (this.processing) {
            return;
        }

        return this._processQueue();
    }

    // Process request from queue
    _processQueue() {

        const self = this;

        if (!this.queue.length) {

            this.processing = false;

            document.dispatchEvent(new CustomEvent('theme:cart:update', {
                detail: self.cart
            }));

            return;
        }

        this.processing = true;

        let params = this.queue.shift();

        params.complete = function(response) {
            self._processQueue();
        }

        return $.ajax(params);
    }

    // Get cart data from API
    _getCart(options = {}) {

        const self = this;

        // Customer account required to purchase
        if (themeApp.data.customerAccountsEnabled == true &&
            themeApp.data.customerAccountsRequireApproval == false &&
            themeApp.data.customerAccountsOptional == false &&
            themeApp.data.customerLoggedIn == false) {

                document.dispatchEvent(new CustomEvent('theme:cart:update', {
                    detail: self.cart
                }));

                return;
        }

        // Customer account requires approval in order to purchase
        if (themeApp.data.customerAccountsEnabled == true &&
            themeApp.data.customerAccountsRequireApproval == true &&
            themeApp.data.customerHasAccess == false) {

                document.dispatchEvent(new CustomEvent('theme:cart:update', {
                    detail: self.cart
                }));

                return;
        }

        options.type = 'GET';

        options.success = function(response) {
            self._updateCart(response);
        };

        options.error = function(response) {
            self.notify.warning(themeApp.utils.t('error.general'));
        };

        return this._addToQueue('/api/cart', null, options);
    }

    // Update cart & item objects
    _updateCart(data = null) {

        if (data) {
            this.cart = data;
            this.items = data.items || {};
        } else {
            this.cart = {};
            this.items = {};
        }
    }

    // Add item
    addItem(id = null, quantity = 1, attributes = [], options = {}) {

        // Missing item id
        if (id === null) {
            return;
        }

        // Customer account required to purchase
        if (themeApp.data.customerAccountsEnabled == true &&
            themeApp.data.customerAccountsRequireApproval == false &&
            themeApp.data.customerAccountsOptional == false &&
            themeApp.data.customerLoggedIn == false) {
                return;
        }

        // Customer account requires approval in order to purchase
        if (themeApp.data.customerAccountsEnabled == true &&
            themeApp.data.customerAccountsRequireApproval == true &&
            themeApp.data.customerHasAccess == false) {
                return;
        }

        const self = this;
        let data = {};

        data.product = id;
        data.quantity = quantity;

        attributes.forEach((item, i) => {
            data[item.name] = item.value;
        });

        options.type = 'POST';

        options.success = function(response) {

            self._updateCart(response);

            const lastItem = response.items.filter(item => item.product_id === parseInt(id, 10))[0];

            if (lastItem) {

                if (self.cartAddNotify) {
                    self.notify.success(themeApp.utils.t('cart.product_added_to_cart'), lastItem.name, null, () => {
                        window.location.href = self.cartUrl;
                    });
                }

                let eventDetail = lastItem;

                eventDetail.currency = self.cart.currency;

                document.dispatchEvent(new CustomEvent('theme:cart:addItem', {
                    detail: eventDetail
                }));
            }
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.utils.t('error.'+response.error));
        };

        return this._addToQueue('/api/cart/items', data, options);
    }

    // Update Item
    updateItem(id = null, quantity = null, options = {}) {

        if (id === null || quantity === null) {
            return;
        }

        const self = this;
        let data = {};

        data.quantity = quantity;
        options.type = 'PUT';

        options.success = function(response) {

            self._updateCart(response);

            let eventDetail = self.items.filter(item => item.id === parseInt(id, 10))[0];

            eventDetail.currency = self.cart.currency;

            document.dispatchEvent(new CustomEvent('theme:cart:updateItem', {
                detail: eventDetail
            }));
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.utils.t('error.'+response.error));
        };

        return this._addToQueue('/api/cart/items/'+id, data, options);
    }

    // Remove item
    removeItem(id = null, options = {}) {

        if (id === null) {
            return;
        }

        const self = this;
        const itemToBeRemoved = self.items.filter(item => item.id === parseInt(id, 10))[0];

        options.type = 'DELETE';

        options.success = function(response) {

            self._updateCart(response);

            if (itemToBeRemoved) {

                let eventDetail = itemToBeRemoved;

                eventDetail.currency = self.cart.currency;

                document.dispatchEvent(new CustomEvent('theme:cart:removeItem', {
                    detail: eventDetail
                }));
            }
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.utils.t('error.'+response.error));
        };

        return this._addToQueue('/api/cart/items/'+id, null, options);
    }

    // Clear cart
    clearItems(options = {}) {

        const self = this;
        const data = null;

        options.type = 'DELETE';

        options.success = function(response) {

            self._updateCart(response);

            document.dispatchEvent(new CustomEvent('theme:cart:clear', {
                detail: self.cart
            }));
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.utils.t('error.'+response.error));
        };

        return this._addToQueue('/api/cart', data, options);
    }
}