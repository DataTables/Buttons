import { ButtonConfig } from "../interface";

export const spacer: ButtonConfig = {
	style: 'empty',
	spacer: true,
	text: function (dt) {
		return dt.i18n('buttons.spacer', '');
	}
};
