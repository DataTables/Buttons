/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons btn-group'
		},
		button: {
			className: 'btn btn-default'
		},
		collection: {
			tag: 'ul',
			className: 'dropdown-menu',
			closeButton: false,
			button: {
				tag: 'li',
				className: 'dt-button',
				active: 'active',
				disabled: 'disabled'
			},
			buttonLiner: {
				tag: 'a',
				className: ''
			}
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper btn-group',
			closeButton: false,
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'btn btn-default dt-btn-split-drop dropdown-toggle',
			closeButton: false,
			align: 'split-left',
			splitAlignClass: 'dt-button-split-left'
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button btn btn-default',
			closeButton: false
		}
	}
} );

DataTable.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="caret"/>');
};
