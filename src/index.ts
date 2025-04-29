import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Page } from './components/view/Page';
import { WebLarekAPI } from './components/WebLarekApi';
import { AppState, TCatalogChangeEvent } from './components/WebLarekModel';
import { CDN_URL, API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/view/Basket';
import { IOrderAddressForm, IOrderContactsForm, IProduct } from './types';
import {
	ProductBasket,
	ProductCatalog,
	ProductPreview,
} from './components/view/Product';
import { OrderAddressForm } from './components/view/OrderAddressForm';
import { OrderContactsForm } from './components/view/OrderContactsForm';
import { OrderSuccess } from './components/view/OrderSuccess';

const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const appState = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderAddress = new OrderAddressForm(
	cloneTemplate(addressTemplate),
	events
);
const orderContact = new OrderContactsForm(
	cloneTemplate(contactsTemplate),
	events
);

// Запрос товаров с сервера
api
	.getProductList()
	.then((list) => {
		appState.setCatalog(list);
	})
	.catch((err) => {
		console.error(`Ошибка загрузки каталога: ${err}`);
	});

// Изменился каталог — отображаем карточки на странице
events.on<TCatalogChangeEvent>('items:change', () => {
	page.counter = appState.basket.length;
	page.catalog = appState.catalog.map((item) => {
		const product = new ProductCatalog(cloneTemplate(productCatalogTemplate), {
			onClick: () => events.emit('preview:open', item),
		});
		return product.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Отображаем превью товара
events.on('preview:open', (item: IProduct) => {
	const getButtonText = () => {
		return appState.basket.includes(item) ? 'Убрать из корзины' : 'В корзину';
	};
	const preview = new ProductPreview(cloneTemplate(productPreviewTemplate), {
		onClick: () => {
			appState.toggleBasketStatus(item);
			preview.buyButtonText = getButtonText();
		},
	});
	preview.buyButtonText = getButtonText();
	modal.render({
		content: preview.render({
			description: item.description,
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		}),
	});
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Изменение товаров в корзине
events.on('basket:update', () => {
	page.counter = appState.basket.length;
	basket.items = appState.basket.map((item, index) => {
		const product = new ProductBasket(
			cloneTemplate(productBasketTemplate),
			index,
			{
				onClick: () => {
					appState.toggleBasketStatus(item);
				},
			}
		);
		return product.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appState.getBasketTotal();
});

// Открыть окно оформления заказа
events.on('order:open', () => {
	appState.order.items = appState.basket.map((item) => item.id);
	appState.order.total = appState.getBasketTotal();
	modal.render({
		content: orderAddress.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменение выбора метода оплаты
events.on('order.paymentMethod:change', (data: { value: string }) => {
	appState.setOrderDetails('payment', data.value);
});

// Изменение данных в поле ввода адреса
events.on(
	'order.address:change',
	(data: { field: keyof IOrderAddressForm; value: string }) => {
		appState.setOrderDetails('address', data.value);
	}
);

// Изменение ошибок валидации формы с адресом
events.on('addressFormErrors:change', (errors: Partial<IOrderAddressForm>) => {
	const { payment, address } = errors;
	orderAddress.valid = !payment && !address;
	orderAddress.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join(' и ');
});

// Переход с модальному окну с формой для ввода контактов
events.on('order:submit', () => {
	modal.render({
		content: orderContact.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменение данных в полях ввода контактов
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrderContactsForm; value: string }) => {
		appState.setContacts(data.field, data.value);
	}
);

// Изменение ошибок валидации формы с контактами
events.on(
	'contactsFormErrors:change',
	(errors: Partial<IOrderContactsForm>) => {
		const { email, phone } = errors;
		orderContact.valid = !email && !phone;
		orderContact.errors = Object.values({ email, phone })
			.filter((i) => !!i)
			.join(' и ');
	}
);

// Оформление заказа и отправка данных на сервер
events.on('contacts:submit', () => {
	api
		.orderProducts(appState.order)
		.then((data) => {
			appState.clearBasket();
			orderAddress.cancelPaymentSelection();
			const orderSuccess = new OrderSuccess(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			modal.render({
				content: orderSuccess.render({
					id: data.id,
					total: data.total,
				}),
			});
		})
		.catch((err) => {
			console.error(`Ошибка при оформлении заказа: ${err}`);
		});
});

// Блокировка скролла страницы при открытом модальном окне
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
