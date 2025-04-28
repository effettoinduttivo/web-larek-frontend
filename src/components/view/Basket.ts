import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasket {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected _items: HTMLElement;
	protected _total: HTMLElement;
	protected _submitButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._items = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.items = [];
		this._submitButton.addEventListener('click', () => {
			events.emit('order:open');
		});
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._items.replaceChildren(...items);
			this.setDisabled(this._submitButton, false);
		} else {
			this._items.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'В корзине пусто...',
				})
			);
			this.setDisabled(this._submitButton, true);
		}
	}

	set total(value: number) {
		this.setText(this._total, `${String(value)} синапсов`);
	}
}
