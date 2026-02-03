/*! Foundation integration for DataTables' Buttons
 * © SpryMedia Ltd - datatables.net/license
 */

var dom = DataTable.dom;
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

dom.s(document).on('buttons-popover.dt', function () {
	var notButton = false;

	dom.s('.dtsp-panesContainer').each(function (el) {
		if (!dom.s(el).is('button')) {
			notButton = true;
		}
	});

	if (notButton) {
		dom.s('.dtsp-panesContainer').classRemove('button-group stacked');
	}
});
