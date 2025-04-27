import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProduct> {
	protected _id: string;
	protected _title: HTMLElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id;
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value === null ? 'Бесценно' : `${String(value)} синапсов`
		);
	}
}

export class ProductBasket extends Product {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, index: number, action?: ICardAction) {
		super(container);

		this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		this.setText(this._index, String(index + 1));

		if (action.onClick) {
			this._deleteButton.addEventListener('click', action.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}
}

export class ProductCatalog extends Product {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	private categories: Record<string, string> = {
		'софт-скил': '_soft',
		'хард-скил': '_hard',
		'другое': '_other',
		'дополнительное': '_additional',
		'кнопка': '_button'
	};

	constructor(container: HTMLElement, action?: ICardAction) {
		super(container);

		this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
		this._category = ensureElement<HTMLElement>('.card__category', this.container);

		if (action?.onClick) {
			container.addEventListener('click', action.onClick);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(`card__category${this.categories[value]}`);
	}
}

export class ProductPreview extends ProductCatalog {
	protected _description: HTMLElement;
	protected _buyButton: HTMLButtonElement;

	constructor(container: HTMLElement, action?: ICardAction) {
		super(container);

		this._description = ensureElement<HTMLElement>('.card__text', this.container);
		this._buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

		if (action.onClick) {
			this._buyButton.addEventListener('click', action.onClick);
		}
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set buyButtonText(value: string) {
		this.setText(this._buyButton, value);
	}

	set price(value: number | null) {
		super.price = value;
		this.isPriceless(value);
	}

	isPriceless(value: number | null) {
		if (value === null) {
			this.setDisabled(this._buyButton, true);
		}
	}
}
