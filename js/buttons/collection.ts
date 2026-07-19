import { ButtonConfig } from "../interface";

export const collection: ButtonConfig = {
	text: function (dt) {
		return dt.i18n('buttons.collection', 'Collection');
	},
	className: 'buttons-collection',
	closeButton: false,
	dropIcon: true,
	init: function (dt, button) {
		button.attr('aria-expanded', false);
	},
	action: function (e, dt, button, config) {
		if (config._collection!.isAttached()) {
			this.popover(false, config);
		}
		else {
			this.popover(config._collection, config);
		}

		// When activated using a key - auto focus on the
		// first item in the popover
		if (e.type === 'keypress') {
			config._collection!.find('a, button').eq(0).focus();
		}
	},
	attr: {
		'aria-haspopup': 'dialog'
	}
	// Also the popover options, defined in Buttons.popover
};
