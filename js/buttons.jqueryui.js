/*! jQuery UI integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons ui-buttonset'
		},
		button: {
			className: 'dt-button ui-button ui-state-default ui-button-text-only',
			disabled: 'ui-state-disabled',
			active: 'ui-state-active'
		},
		buttonLiner: {
			tag: 'span',
			className: 'ui-button-text'
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper dt-btn-split-wrapper ui-widget ui-controlgroup-item ui-corner-left',
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'dt-btn-split-drop ui-selectmenu-button demo-splitbutton-select ui-button ui-widget ui-controlgroup-item ui-selectmenu-button-closed ui-corner-right',
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button ui-button'
		}
	}
} );

DataTable.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-s"/>');
};
