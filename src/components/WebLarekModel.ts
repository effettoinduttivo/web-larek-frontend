import {
	IAppState,
	IOrder,
	IOrderAddressForm,
	IOrderContactsForm,
	IProduct,
	TFormErrors,
	TPaymentMethod,
} from '../types';
import { formErrorsConfig } from '../utils/constants';
import { Model } from './base/Model';

export type TCatalogChangeEvent = {
	catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
	catalog: IProduct[];
	basket: IProduct[] = [];
	order: IOrder = {
		items: [],
		total: 0,
		payment: '',
		address: '',
		email: '',
		phone: '',
	};
	formErrors: TFormErrors = {};

	setCatalog(products: IProduct[]): void {
		this.catalog = products;
		this.emitChanges('items:change', { catalog: this.catalog });
	}

	toggleBasketStatus(product: IProduct): void {
		if (!this.basket.includes(product)) {
			this.basket.push(product);
		} else {
			this.basket = this.basket.filter((item) => item !== product);
		}
		this.emitChanges('basket:update');
	}

	getBasketTotal(): number {
		return this.basket.reduce((prevVal, item) => prevVal + item.price, 0);
	}

	clearBasket(): void {
		this.basket = [];
		this.order = {
			items: [],
			total: 0,
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.emitChanges('basket:update');
	}

	setOrderDetails(field: keyof IOrderAddressForm, value: string): void {
		if (field === 'payment') {
			this.order[field] = value as TPaymentMethod;
		} else {
			this.order[field] = value;
		}
		this.validateAddress();
	}

	setContacts(field: keyof IOrderContactsForm, value: string): void {
		this.order[field] = value;
		this.validateContacts();
	}

	private validateAddress(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.payment) {
			errors.payment = formErrorsConfig.paymentError;
		}
		if (!this.order.address) {
			errors.address = formErrorsConfig.addressError;
		}
		this.formErrors = errors;
		this.events.emit('addressFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	private validateContacts(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = formErrorsConfig.emailError;
		}
		if (!this.order.phone) {
			errors.phone = formErrorsConfig.phoneError;
		}
		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
