import 'jquery-serializejson';
import Notify from './notify';

export default class Cart {

    constructor() {

        this.cart = {};
        this.items = {};
        this.notifyProductAdd = true;
        this.queue = [];
        this.processing = false;
        this.notify = new Notify();
        this.cartTemplateEl = document.querySelector('#hbs-cart-template');
        this.cartMiniTemplateEl = document.querySelector('#hbs-cart-mini-template');
        this.cartTemplate = null;
        this.cartMiniTemplate = null;
    }

    // Init
    init() {

        this.cartUrl = themeApp.data.routes.cartUrl;
        this.checkoutUrl = themeApp.data.routes.checkoutUrl;
        this.assetUrl = themeApp.data.routes.assetUrl;

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
                    let variants = [];

                    delete data['form_type'];
                    delete data['form_id'];

                    for (const key in data) {

                        if (key === 'product_id') {

                            itemId = data[key];

                        } else if (key === 'quantity') {

                            quantity = data[key];

                        } else {

                            variants.push({
                                name: key,
                                value: data[key]
                            });
                        }
                    };

                    if (!itemId || !quantity) {
                        return false;
                    }

                    return self.addItem(parseInt(itemId, 10), parseInt(quantity, 10), variants);
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

            let items = [];

            self.items.forEach((item, i) => {

                let obj = {};

                obj.id = item.id;
                obj.name = item.name;
                obj.list_name = '';
                obj.brand = '';
                obj.category = '';
                obj.variant = item.variant_label;
                obj.list_position = '';
                obj.quantity = item.price;
                obj.price = item.price_raw;

                items.push(obj);
            });

            self._addDataLayerArgs('event', 'begin_checkout', {
                'items': items,
                'coupon': ''
            });
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

                if (self.cart.item_count > 0 && !el.classList.contains('has-items')) {

                    el.classList.add('has-items');

                } else if (self.cart.item_count < 1 && el.classList.contains('has-items')) {

                    el.classList.remove('has-items');
                }

                el.innerHTML = self.cart.item_count;
            });

            subtotalEls.forEach(el => {
                el.innerHTML = self.cart.subtotal;
            });

            paymentFeeEls.forEach(el => {
                el.innerHTML = self.cart.payment_fee;
            });

            shippingPriceEls.forEach(el => {
                el.innerHTML = self.cart.shipping_price;
            });

            if (discountsEls && self.cart.discounts.length) {

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
                el.innerHTML = self.cart.tax_free;
            });

            taxEls.forEach(el => {
                el.innerHTML = self.cart.tax;
            });

            totalEls.forEach(el => {
                el.innerHTML = self.cart.total;
            });

            if (cartContainerEl) {

                cartContainerEl.innerHTML = self.cartTemplate({
                    cart: self.cart,
                    itemCount: self.items.length,
                    assetUrl: self.assetUrl,
                    cartUrl: self.cartUrl,
                    checkoutUrl: self.checkoutUrl,
                    placeholderImgSrc: themeApp.data.placeholderImgSrc
                });

                cartContainerEl.querySelectorAll('[data-cart-quantity-dynamic]').forEach(el => { el.addEventListener('change', e => {
                    quantityDynamic(e);
                })});
            }

            if (cartMiniContainerEl) {

                cartMiniContainerEl.innerHTML = self.cartMiniTemplate({
                    cart: self.cart,
                    itemCount: self.items.length,
                    assetUrl: self.assetUrl,
                    cartUrl: self.cartUrl,
                    checkoutUrl: self.checkoutUrl,
                    placeholderImgSrc: themeApp.data.placeholderImgSrc
                });

                cartMiniContainerEl.querySelectorAll('[data-cart-quantity-dynamic]').forEach(el => { el.addEventListener('change', e => {
                    quantityDynamic(e);
                })});
            }

            document.dispatchEvent(new CustomEvent('cartRendered'));
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

        document.addEventListener('cartUpdated', (e) => {
            render(e)
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

            document.dispatchEvent(new CustomEvent('cartUpdated'));

            return;
        }

        this.processing = true;

        let params = this.queue.shift();

        params.complete = function(response) {
            self._processQueue();
        }

        return $.ajax(params);
    }

    // Add information to datalyer for tracking libs
    _addDataLayerArgs(args) {
        if (window.dataLayer) {
            dataLayer.push(args);
        }
    }

    // Get cart data from API
    _getCart(options = {}) {

        const self = this;

        options.type = 'GET';

        options.success = function(response) {
            self._updateCart(response);
        };

        options.error = function(response) {
            self.notify.warning(themeApp.t('error.general'));
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
    addItem(id = null, quantity = 1, variants = [], options = {}) {

        if (id === null) {
            return;
        }

        const self = this;
        let data = {};

        data.product = id;
        data.quantity = quantity;

        variants.forEach((item, i) => {
            data[item.name] = item.value;
        });

        options.type = 'POST';

        options.success = function(response) {

            self._updateCart(response);

            const lastItem = response.items.filter(item => item.product_id === parseInt(id, 10))[0];

            if (lastItem) {

                if (self.notifyProductAdd) {
                    self.notify.success(themeApp.t('cart.product_added_to_cart'), lastItem.name, null, () => {
                        window.location.href = self.cartUrl;
                    });
                }

                let items = [];
                let obj = {};

                obj.id = lastItem.id;
                obj.name = lastItem.name;
                obj.list_name = '';
                obj.brand = '';
                obj.category = '';
                obj.variant = lastItem.variant_label;
                obj.list_position = '';
                obj.quantity = lastItem.amount;
                obj.price = lastItem.price_raw;

                items.push(obj);

                self._addDataLayerArgs('event', 'add_to_cart', {
                    'items': items
                });
            }
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.t('error.'+response.error));
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
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.t('error.'+response.error));
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

                let items = [];
                let obj = {};

                obj.id = itemToBeRemoved.id;
                obj.name = itemToBeRemoved.name;
                obj.list_name = '';
                obj.brand = '';
                obj.category = '';
                obj.variant = itemToBeRemoved.variant_label;
                obj.list_position = '';
                obj.quantity = itemToBeRemoved.amount;
                obj.price = itemToBeRemoved.price_raw;

                items.push(obj);

                self._addDataLayerArgs('event', 'remove_from_cart', {
                    'items': items
                });
            }
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.t('error.'+response.error));
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
        };

        options.error = function(response) {

            response = JSON.parse(response.responseText);

            self.notify.warning(null, themeApp.t('error.'+response.error));
        };

        return this._addToQueue('/api/cart', data, options);
    }
}