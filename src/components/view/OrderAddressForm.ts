import { IOrderAddressForm, TPaymentMethod } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class OrderAddressForm extends Form<IOrderAddressForm> {
	protected _addressInput: HTMLInputElement;
	protected _cardButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', this.container);
		this._cardButton = ensureElement<HTMLButtonElement>('button[name=card]', this.container);
		this._cashButton = ensureElement<HTMLButtonElement>('button[name=cash]', this.container);

		this._cardButton.addEventListener('click', () => this.pickPayment('card'));
		this._cashButton.addEventListener('click', () => this.pickPayment('cash'));
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	private pickPayment(method: TPaymentMethod): void {
		this.toggleClass(this._cardButton, 'button_alt-active', method === 'card');
		this.toggleClass(this._cashButton, 'button_alt-active', method === 'cash');

		this.events.emit(`${this.container.name}.paymentMethod:change`, {
			value: method
		});
	}
}
