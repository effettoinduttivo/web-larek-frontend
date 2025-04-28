import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _content: HTMLElement;
	protected _closeButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._content = ensureElement<HTMLElement>('.modal__content', container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this._content.addEventListener('click', (event) => event.stopPropagation());
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
