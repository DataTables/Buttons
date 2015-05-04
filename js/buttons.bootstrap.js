
(function($, DataTables){

$.extend( true, DataTables.Buttons.defaults, {
	dom: {
		container: {
			className: 'btn-group'
		},
		button: {
			className: 'btn btn-default'
		},
		collection: {
			tag: 'ul',
			className: 'dt-button-collection dropdown-menu',
			button: {
				tag: 'li',
				className: 'dt-button'
			},
			buttonLiner: {
				tag: 'a',
				className: ''
			}
		}
	}
} );

DataTables.ext.buttons.collection.text = function ( dt ) {
	return dt.i18n('buttons.collection', 'Collection <span class="caret"></span>');
};



/*

Buttons.defaults = {
	buttons: [ 'copy', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			tag: 'a',
			className: 'dt-button'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

 */

})(jQuery, jQuery.fn.dataTable);