/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons ui basic buttons'
		},
		button: {
			tag: 'button',
			className: 'dt-button ui button',
			spacerClass: 'dt-button ui button'
		},
		collection: {
			tag: 'div',
			className: 'ui basic vertical buttons',
			closeButton: false
		},
		splitWrapper: {
			tag: 'div',
			className: 'dt-btn-split-wrapper buttons',
			closeButton: false
		},
		splitDropdown: {
			tag: 'button',
			text: '&#x25BC;',
			className: 'ui floating button dt-btn-split-drop dropdown icon',
			closeButton: false
		},
		splitDropdownButton: {
			tag: 'button',
			className: 'dt-btn-split-drop-button ui button',
			closeButton: false
		}
	}
} );

$(document).on('buttons-popover.dt', function () {
	var notButton = false;
	$('.dtsp-panesContainer').each(function() {
		if(!$(this).is('button')){
			notButton = true;
		}
	});
	if(notButton){
		$('.dtsp-panesContainer').removeClass('vertical buttons')
	}
});
