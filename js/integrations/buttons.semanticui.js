/*! Buttons Fomantic styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

var Dom = DataTable.Dom;
var util = DataTable.util;

util.object.assignDeep(DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons ui buttons'
		},
		button: {
			tag: 'button',
			active: 'active',
			className: 'dt-button ui button',
			spacerClass: 'dt-button ui button',
			dropHtml: '<i class="dropdown icon"></i>',
			dropClass: ''
		},
		collection: {
			container: {
				tag: 'div',
				className: 'ui dropdown active visible dt-button-collection',
				content: {
					className: 'resizable scrolling menu'
				}
			},
			closeButton: false,
			button: {
				tag: 'a',
				className: 'dt-button item',
				active: 'dt-button-active',
				spacer: {
					className: 'divider',
					tag: 'div'
				}
			},
			split: {
				action: {
					tag: 'div',
					className: ''
				},
				dropdown: {
					tag: 'span',
					className: 'dt-button-split-drop dropdown icon'
				},
				wrapper: {
					tag: 'div',
					className: 'dt-button-split'
				}
			}
		},
		split: {
			action: {
				tag: 'button',
				className: 'dt-button-split-drop-button ui button'
			},
			dropdown: {
				tag: 'button',
				className:
					'ui floating button dt-button-split-drop dropdown icon'
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split buttons'
			}
		}
	}
});

Dom.on('buttons-popover.dt', function () {
	var notButton = false;

	Dom.s('.dtsp-panesContainer').each(function (el) {
		if (!Dom.s(el).is('button')) {
			notButton = true;
		}
	});

	if (notButton) {
		Dom.s('.dtsp-panesContainer').classRemove('vertical buttons');
	}
});
