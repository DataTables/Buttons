import { ButtonConfig } from "../interface";

export const split: ButtonConfig = {
	text: function (dt) {
		return dt.i18n('buttons.split', 'Split');
	},
	className: 'buttons-split',
	closeButton: false,
	init: function (dt, button) {
		return button.attr('aria-expanded', false);
	},
	action: function (e, dt, button, config) {
		this.popover(config._collection, config);
	},
	attr: {
		'aria-haspopup': 'dialog'
	}
	// Also the popover options, defined in Buttons.popover
};