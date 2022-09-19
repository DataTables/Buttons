/*! Bulma integration for DataTables' Buttons
 * ©2021 SpryMedia Ltd - datatables.net/license
 */

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons field is-grouped'
		},
		button: {
			className: 'button is-light',
			active: 'is-active',
			disabled: 'is-disabled'
		},
		collection: {
			tag: 'div',
			closeButton: false,
			className: 'dropdown-content',
			button: {
				tag: 'a',
				className: 'dt-button dropdown-item',
				active: 'is-active',
				disabled: 'is-disabled'
			}
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper dropdown-trigger buttons has-addons',
			closeButton: false
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button button is-light',
			closeButton: false
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'button is-light',
			closeButton: false,
			align: 'split-left',
			splitAlignClass: 'dt-button-split-left'
		}
	},
	buttonCreated: function ( config, button ) {
		// For collections
		if (config.buttons) {
			// Wrap the dropdown content in a menu element
			config._collection = $('<div class="dropdown-menu"/>')
				.append(config._collection);
			
			// And add the collection dropdown icon
			$(button).append(
				'<span class="icon is-small">' +
					'<i class="fa fa-angle-down" aria-hidden="true"></i>' +
				'</span>'
			);
		}

		return button;
	}
} );
