/*! jQuery UI integration for DataTables' Buttons
 * © SpryMedia Ltd - datatables.net/license
 */

$.extend(true, DataTable.Buttons.defaults, {
	dom: {
		collection: {
			button: {
				active: 'dt-button-active'
			}
		},
		container: {
			className: 'dt-buttons ui-buttonset'
		},
		button: {
			className: 'dt-button ui-button ui-corner-all',
			disabled: 'ui-state-disabled',
			active: 'ui-state-active',
			liner: {
				tag: 'span',
				className: ''
			},
			dropHtml: '<span class="ui-button-icon-primary ui-icon ui-icon-triangle-1-s"/>',
			dropClass: ''
		},
		split: {
			action: {
				tag: 'button',
				className: 'dt-button-split-drop-button ui-button ui-corner-left'
			},
			dropdown: {
				tag: 'button',
				className: 'dt-button-split-drop ui-button ui-corner-right'
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split'
			}
		}
	}
});
