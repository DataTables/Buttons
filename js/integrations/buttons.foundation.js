/*! Buttons Foundation styling for DataTables
 * Copyright (c) SpryMedia Ltd - datatables.net/license
 */

var Dom = DataTable.Dom;
var util = DataTable.util;

util.object.assignDeep(DataTable.Buttons.defaults, {
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons button-group'
		},
		button: {
			tag: 'a',
			className: 'dt-button button small',
			active: 'secondary active'
		},
		collection: {
			button: {
				tag: 'li',
				className: 'dt-button',
				active: 'dt-button-active-a',
				liner: {
					tag: 'a'
				}
			},
			container: {
				tag: 'div',
				className: 'dt-button-collection',
				content: {
					tag: 'ul',
					className: 'dropdown menu is-dropdown-submenu'
				}
			}
		},
		split: {
			action: {
				tag: 'button',
				className: 'button small'
			},
			dropdown: {
				tag: 'button',
				className: 'button arrow-only'
			},
			wrapper: {
				tag: 'div',
				className: 'button-group dt-button-split'
			}
		}
	}
});

Dom.s(document).on('buttons-popover.dt', function () {
	var notButton = false;

	Dom.s('.dtsp-panesContainer').each(function (el) {
		if (!Dom.s(el).is('button')) {
			notButton = true;
		}
	});

	if (notButton) {
		Dom.s('.dtsp-panesContainer').classRemove('button-group stacked');
	}
});
