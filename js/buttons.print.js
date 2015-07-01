/*!
 * Print button for Buttons and DataTables.
 * 2015 SpryMedia Ltd - datatables.net/license
 */

(function($, DataTable) {
"use strict";


var _link = document.createElement( 'a' );

/**
 * Convert a `link` tag's URL from a relative to an absolute address so it will
 * work correctly in the popup window which has no base URL.
 *
 * @param  {interger} i  Counter from jQuery - ignore
 * @param  {node}     el Element to convert
 */
var _relToAbs = function( i, el ) {
	var url;

	if ( el.nodeName.toLowerCase() === 'link' ) {
		_link.href = el.href;

		el.href = _link.protocol+"//"+_link.host+_link.pathname+_link.search;
	}
};


DataTable.ext.buttons.print = {
	className: 'buttons-print',

	text: function ( dt ) {
		return dt.i18n( 'buttons.print', 'Print' );
	},

	action: function ( e, dt, button, config ) {
		var data = dt.buttons.exportData( config.exportOptions );
		var addRow = function ( d, tag ) {
			var str = '<tr>';

			for ( var i=0, ien=d.length ; i<ien ; i++ ) {
				str += '<'+tag+'>'+d[i]+'</'+tag+'>';
			}

			return str + '</tr>';
		};

		// Construct a table for printing
		var html = '<table class="'+dt.table().node().className+'">';

		if ( config.header ) {
			html += '<thead>'+ addRow( data.header, 'th' ) +'</thead>';
		}

		html += '<tbody>';
		for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
			html += addRow( data.body[i], 'td' );
		}
		html += '</tbody>';

		if ( config.footer ) {
			html += '<thead>'+ addRow( data.footer, 'th' ) +'</thead>';
		}

		// Open a new window for the printable table
		var win = window.open( '', '' );
		var title = config.title.replace( '*', $('title').text() );

		// Inject the title and also a copy of the style and link tags from this
		// document so the table can retain its base styling.
		$(win.document.head)
			.append( '<title>'+title+'</title>' )
			.append(
				$('style, link').clone().each( _relToAbs )
			);

		// Inject the table and other surrounding information
		$(win.document.body)
			.append( '<h1>'+title+'</h1>' )
			.append( '<div>'+config.message+'</div>' )
			.append( html );

		if ( config.customize ) {
			config.customize( win );
		}

		setTimeout( function () {
			if ( config.autoPrint ) {
				win.print(); // blocking - so close will not
				win.close(); // execute until this is done
			}
		}, 250 );
	},

	title: '*',

	message: '',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};


})(jQuery, jQuery.fn.dataTable);
