import { IOrderResult } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IOrderAction {
  onClick: (event: MouseEvent) => void;
}

export class OrderSuccess extends Component<IOrderResult> {
  protected _id: string;
  protected _total: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, action?: IOrderAction) {
    super(container);

    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    if(action?.onClick) {
      this._closeButton.addEventListener('click', action.onClick);
    }
  }

  set id(value: string) {
    this._id = value;
  }
  
  get id(): string {
    return this._id;
  }

  set total(value: number) {
    this.setText(this._total, `Списано ${String(value)} синапсов`)
  }
}