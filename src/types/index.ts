export type TCategory =
	| 'хард-скил'
	| 'софт-скил'
	| 'кнопка'
	| 'дополнительное'
	| 'другое';

export type TPaymentMethod = 'card' | 'cash' | '';

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[] | null;
	order: IOrder | null;
	formErrors: TFormErrors;

	setCatalog(products: IProduct[]): void;
	toggleBasketStatus(product: IProduct): void;
	getBasketTotal(): number;
	clearBasket(): void;
	setOrderDetails(field: keyof IOrderAddressForm, value: string): void;
	setContacts(field: keyof IOrderContactsForm, value: string): void;
	validateAddress(): boolean;
	validateContacts(): boolean;
}

export interface IProduct {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: TCategory;
	price: number | null;
}

export interface IOrderAddressForm {
	payment: TPaymentMethod;
	address: string;
}

export interface IOrderContactsForm {
	email: string;
	phone: string;
}

export interface IOrder extends IOrderAddressForm, IOrderContactsForm {
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}
