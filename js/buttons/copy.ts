/*
 * Copy to clipboard button
 */

import DataTable, { Dom } from 'datatables.net';
import '../interface';
import { ButtonConfig, ButtonFunction } from '../interface';
import { exportData, newLine } from './support';


export const copy: ButtonFunction = function (dt, conf) {
	if (DataTable.ext.buttons.copyHtml5) {
		return 'copyHtml5';
	}
};

export const copyHtml5: ButtonConfig = {
	className: 'buttons-copy buttons-html5',

	text: function (dt) {
		return dt.i18n('buttons.copy', 'Copy');
	},

	action: function (e, dt, button, config, cb) {
		var exportD = exportData(dt, config);
		var info = dt.buttons.exportInfo(config as any);
		var newline = newLine(config);
		var output = exportD.str;
		var hiddenDiv = Dom.c('div').css({
			height: '1px',
			width: '1px',
			overflow: 'hidden',
			position: 'fixed',
			top: '0',
			left: '0'
		});

		if (info.title) {
			output = info.title + newline + newline + output;
		}

		if (info.messageTop) {
			output = info.messageTop + newline + newline + output;
		}

		if (info.messageBottom) {
			output = output + newline + newline + info.messageBottom;
		}

		if (config.customize) {
			output = config.customize(output, config, dt);
		}

		var textarea = Dom.c<HTMLTextAreaElement>('textarea')
			.prop('readonly', true)
			.val(output)
			.appendTo(hiddenDiv);

		// For browsers that support the copy execCommand, try to use it
		if (document.queryCommandSupported('copy')) {
			hiddenDiv.appendTo(dt.table().container());
			textarea.get(0).focus();
			textarea.get(0).select();

			try {
				var successful = document.execCommand('copy');
				hiddenDiv.remove();

				if (successful) {
					if (config.copySuccess) {
						dt.buttons.info(
							dt.i18n('buttons.copyTitle', 'Copy to clipboard'),
							dt.i18n(
								'buttons.copySuccess',
								{
									1: 'Copied one row to clipboard',
									_: 'Copied %d rows to clipboard'
								},
								exportD.rows
							),
							2000
						);
					}

					cb();
					return;
				}
			} catch (t) {
				// noop
			}
		}

		// Otherwise we show the text box and instruct the user to use it
		var message = Dom.c('span')
			.html(
				dt.i18n(
					'buttons.copyKeys',
					'Press <i>ctrl</i> or <i>\u2318</i> + <i>C</i> to copy the table data<br>to your system clipboard.<br><br>' +
						'To cancel, click this message or press escape.'
				)
			)
			.append(hiddenDiv);

		dt.buttons.info(
			dt.i18n('buttons.copyTitle', 'Copy to clipboard'),
			message.get(0),
			0
		);

		// Select the text so when the user activates their system clipboard
		// it will copy that text
		textarea.get(0).focus();
		textarea.get(0).select();

		// Event to hide the message when the user is done
		var container = message.closest('.dt-button-info');
		var close = function () {
			container.off('click.buttons-copy');
			Dom.s(document).off('.buttons-copy');
			dt.buttons.info(false);
		};

		container.on('click.buttons-copy', function () {
			close();
			cb();
		});

		Dom.s(document)
			.on('keydown.buttons-copy', function (e) {
				if (e.keyCode === 27) {
					// esc
					close();
					cb();
				}
			})
			.on('copy.buttons-copy cut.buttons-copy', function () {
				close();
				cb();
			});
	},

	async: 100,

	copySuccess: true,

	exportOptions: {},

	fieldSeparator: '\t',

	fieldBoundary: '',

	header: true,

	footer: true,

	title: '*',

	messageTop: '*',

	messageBottom: '*'
} as ButtonConfig;
