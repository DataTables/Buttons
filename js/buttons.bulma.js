/*! Bulma integration for DataTables' Buttons
 * © SpryMedia Ltd - datatables.net/license
 */

$.extend(true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons field is-grouped'
		},
		button: {
			className: 'button',
			active: 'is-active',
			disabled: 'is-disabled',
			dropHtml: '<span class="icon is-small"><i class="fa fa-angle-down" aria-hidden="true"></i></span>',
			dropClass: ''
		},
		collection: {
			action: {
				tag: 'div',
				className: 'dropdown-content'
			},
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'dt-button-active',
				disabled: 'is-disabled',
				spacer: {
					className: 'dropdown-divider',
					tag: 'hr'
				}
			},
			closeButton: false,
			container: {
				className: 'dt-button-collection dropdown dropdown-menu',
				content: {
					className: 'dropdown-content'
				}
			}
		},
		split: {
			action: {
				tag: 'button',
				className: 'dt-button-split-drop-button button',
				closeButton: false
			},
			dropdown: {
				tag: 'button',
				className: 'button',
				closeButton: false,
				align: 'split-left',
				splitAlignClass: 'dt-button-split-left'
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split dropdown-trigger buttons has-addons',
				closeButton: false
			}
		}
	},
	buttonCreated: function (config, button) {
		// For collections
		if (config.buttons) {
			// Wrap the dropdown content in a menu element
			config._collection = $('<div class="dropdown-menu"/>').append(config._collection);
		}

		return button;
	}
});
