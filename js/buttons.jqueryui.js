/*! jQuery UI integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		collection: {
			action: {
				dropHtml: '<span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-s"/>'
			},
		},
		container: {
			className: 'dt-buttons ui-buttonset',
		},
		button: {
			className: 'dt-button ui-button ui-corner-all',
			disabled: 'ui-state-disabled',
			active: 'ui-state-active',
			liner: {
				tag: '',
				className: ''
			}
		},
		split: {
			action: {
				tag: 'button',
				className: 'dt-button-split-drop-button ui-button ui-corner-left'
			},
			dropdown: {
				tag: 'button',
				dropHtml: '<span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-s"/>',
				className: 'dt-button-split-drop ui-button ui-corner-right',
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split',
			}
		}
	}
} );

