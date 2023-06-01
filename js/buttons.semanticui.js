/*! Bootstrap integration for DataTables' Buttons
 * © SpryMedia Ltd - datatables.net/license
 */

$.extend(true, DataTable.Buttons.defaults, {
	dom: {
		container: {
			className: 'dt-buttons ui buttons'
		},
		button: {
			tag: 'button',
			active: 'active',
			className: 'dt-button ui button',
			spacerClass: 'dt-button ui button'
		},
		collection: {
			action: {
				dropHtml: '<i class="dropdown icon"></i>'
			},
			container: {
				tag: 'div',
				className: 'ui dropdown active visible dt-button-collection',
				content: {
					className: 'menu transition visible'
				}
			},
			closeButton: false,
			button: {
				tag: 'div',
				className: 'item',
				active: 'dt-button-active',
				spacer: {
					className: 'divider',
					tag: 'div'
				}
			},
			split: {
				action: {
					tag: 'div',
					className: ''
				},
				dropdown: {
					tag: 'span',
					className: 'dt-button-split-drop dropdown icon',
					dropHtml: '<i class="dropdown icon"></i>'
				},
				wrapper: {
					tag: 'div',
					className: 'dt-button-split'
				}
			}
		},
		split: {
			action: {
				tag: 'button',
				className: 'dt-button-split-drop-button ui button'
			},
			dropdown: {
				tag: 'button',
				className: 'ui floating button dt-button-split-drop dropdown icon'
			},
			wrapper: {
				tag: 'div',
				className: 'dt-button-split buttons'
			}
		}
	}
});

$(document).on('buttons-popover.dt', function () {
	var notButton = false;
	$('.dtsp-panesContainer').each(function () {
		if (!$(this).is('button')) {
			notButton = true;
		}
	});
	if (notButton) {
		$('.dtsp-panesContainer').removeClass('vertical buttons');
	}
});
