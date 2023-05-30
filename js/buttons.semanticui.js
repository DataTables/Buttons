/*! Bootstrap integration for DataTables' Buttons
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

$.extend( true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons ui buttons'
		},
		button: {
			tag: 'button',
			className: 'dt-button ui button',
			spacerClass: 'dt-button ui button'
		},
		collection: {
			tag: 'div',
			className: 'ui vertical buttons',
			closeButton: false,
			button: {

			}
		},
		split: {
			button: {
				tag: 'button',
				className: 'dt-button-split-drop-button ui button',
				closeButton: false
			},
			dropdown: {
				tag: 'button',
				text: '&#x25BC;',
				className: 'ui floating button dt-button-split-drop dropdown icon',
				closeButton: false
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split buttons',
				closeButton: false
			}
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
