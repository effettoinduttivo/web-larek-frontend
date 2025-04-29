export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const formErrorsConfig = {
	paymentError: 'Выберите способ оплаты',
	addressError: 'Укажите адрес доставки',
	emailError: 'Введите email',
	phoneError: 'Введите номер телефона',
};

export const categoriesConfig = {
	'софт-скил': '_soft',
	'хард-скил': '_hard',
	другое: '_other',
	дополнительное: '_additional',
	кнопка: '_button',
};
