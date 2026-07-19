/*
 * Save to CSV file
 */

import DataTable from 'datatables.net';
import '../interface';
import { ButtonConfig, ButtonFunction } from '../interface';
import { exportData } from './support';

export const csv: ButtonFunction = function (dt, conf) {
	if (
		typeof DataTable.ext.buttons.csvHtml5 === 'object' &&
		DataTable.ext.buttons.csvHtml5.available!(dt, conf)
	) {
		return 'csvHtml5';
	}
};

export const csvHtml5: ButtonConfig = {
	bom: false,

	className: 'buttons-csv buttons-html5',

	available: function () {
		return window.FileReader !== undefined && window.Blob ? true : false;
	},

	text: function (dt) {
		return dt.i18n('buttons.csv', 'CSV');
	},

	action: function (e, dt, button, config, cb) {
		// Set the text
		var output = exportData(dt, config).str;
		var info = dt.buttons.exportInfo(config as any);
		var charset = config.charset;

		if (config.customize) {
			output = config.customize(output, config, dt);
		}

		if (charset !== false) {
			if (!charset) {
				charset = document.characterSet || document.charset;
			}

			if (charset) {
				charset = ';charset=' + charset;
			}
		}
		else {
			charset = '';
		}

		if (config.bom) {
			output = String.fromCharCode(0xfeff) + output;
		}

		DataTable.fileSave(
			new Blob([output], { type: 'text/csv' + charset }),
			info.filename,
			true
		);

		cb();
	},

	async: 100,

	filename: '*',

	extension: '.csv',

	exportOptions: {
		escapeExcelFormula: true
	},

	fieldSeparator: ',',

	fieldBoundary: '"',

	escapeChar: '"',

	charset: null,

	header: true,

	footer: true
};
