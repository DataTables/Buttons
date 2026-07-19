/*
 * Page length
 */

import { Api, util } from 'datatables.net';
import '../interface';
import { FunctionButton } from '../interface';

export const pageLength: FunctionButton = function (dt) {
	var lengthMenu = dt.settings()[0].lengthMenu;
	var vals = [];
	var lang: string[] = [];
	var text = function (dt: Api) {
		return dt.i18n(
			'buttons.pageLength',
			{
				'-1': 'Show all rows',
				_: 'Show %d rows'
			},
			dt.page.len()
		);
	};

	// Support for DataTables 1.x 2D array
	if (Array.isArray(lengthMenu[0])) {
		vals = lengthMenu[0];
		lang = lengthMenu[1];
	}
	else {
		for (var i = 0; i < lengthMenu.length; i++) {
			var option = lengthMenu[i];

			// Support for DataTables 2 object in the array
			if (util.is.plainObject(option)) {
				vals.push(option.value);
				lang.push(option.label);
			}
			else {
				vals.push(option);
				lang.push(option);
			}
		}
	}

	return {
		extend: 'collection',
		text: text,
		className: 'buttons-page-length',
		autoClose: true,
		buttons: vals.map(function (val, i) {
			return {
				text: lang[i],
				className: 'button-page-length',
				action: function (e, dt) {
					dt.page.len(val).draw();
				},
				init: function (dt, node, conf) {
					var that = this;
					var fn = function () {
						that.active(dt.page.len() === val);
					};

					dt.on('length.dt' + conf.namespace, fn);
					fn();
				},
				destroy: function (dt, node, conf) {
					dt.off('length.dt' + conf.namespace);
				}
			};
		}),
		init: function (dt, node, conf) {
			var that = this;
			dt.on('length.dt' + conf.namespace, function () {
				that.text(conf.text);
			});
		},
		destroy: function (dt, node, conf) {
			dt.off('length.dt' + conf.namespace);
		}
	};
};
