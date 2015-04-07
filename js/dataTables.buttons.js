/* Buttons for DataTables
 * 2015 SpryMedia Ltd - datatables.net/license
 */
(function(window, document, undefined) {


var factory = function( $, DataTable ) {
"use strict";



var Buttons = function( dt, buttons )
{
	this.c = $.extend( true, {}, Buttons.defaults );

	if ( buttons ) {
		this.c.buttons = buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt )
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};

Buttons.prototype = {
	node: function ()
	{
		return this.dom.container;
	},


	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;

		this._buildButtons( this.c.buttons );
	},


	_buildButtons: function ( buttons, container )
	{
		var dtButtons = DataTable.ext.buttons;

		if ( ! container ) {
			container = this.dom.container;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = buttons[i];

			if ( typeof conf === 'function' ) {
				conf = conf( this.s.dt );
			}

			if ( typeof conf === 'string' ) {
				conf = $.extend( true, {}, dtButtons[ conf ] );
			}

			while ( conf.extend ) {
				// xxx what if dtButtons[ conf.extend ] is a function? or a string (why would it be a string?)
				// xxx drop the function and string resolver into a function?
				conf = $.extend( true, {}, dtButtons[ conf.extend ], conf );

				// Although we want the `conf` object to overwrite almost all of
				// the properties of the object being extended, the `extend`
				// property should from from the object being extended
				conf.extend = dtButtons[ conf.extend ].extend;
			}

			var button = this._buildButton( conf );

			container.append( button );

			if ( conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				conf._collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className );

				this._buildButtons( conf.buttons, conf._collection );
			}
		}
	},


	_buildButton: function ( config )
	{
		var that = this;
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;

		var button = $('<'+buttonDom.tag+'/>')
			.addClass( buttonDom.className )
			.on( 'click', function (e) {
				config.action.call( that, e, that.s.dt, button, config );
			} );

		if ( linerDom.tag ) {
			button.append(
				$('<'+linerDom.tag+'/>')
					.html( config.text )
					.addClass( linerDom.className )
			);
		}
		else {
			button.html( config.text );
		}

		return button;
	}
};


Buttons.defaults = {
	buttons: [ 'copy', 'csv', 'pdf', 'print' ],
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



/**
 * Version information
 *
 * @name Buttons.version
 * @static
 */
Buttons.version = '1.0.0';



$.extend( DataTable.ext.buttons, {
	text: {
		text: '',
		className: 'buttons-text',
		action: function ( e, dt, button, config ) {}
	},
	collection: {
		text: 'Collection',
		className: 'buttons-collection',
		action: function ( e, dt, button, config ) {
			var background;
			var host = button;
			var hostOffset = host.offset();
			var tableContainer = $( dt.table().container() );

			config._collection
				.appendTo( 'body' )
				.css( {
					top: hostOffset.top + host.height(),
					left: hostOffset.left
				} );

			var listRight = hostOffset.left + config._collection.outerWidth();
			var tableRight = tableContainer.offset().left + tableContainer.width();
			if ( listRight > tableRight ) {
				config._collection.css( 'left', hostOffset.left - ( listRight - tableRight ) );
			}

			if ( config.background ) {
				background = $('<div/>')
					.addClass( config.backgroundClassName )
					.appendTo( 'body' );
			}

			// Need to break the 'thread' for the collection button being
			// activated by a click - it would also trigger this event
			setTimeout( function () {
				$(document).on( 'click.dtb-collection', function (e) {
					if ( ! $(e.target).parents().andSelf().filter( config._collection ).length ) {
						config._collection.remove();

						if ( background ) {
							background.remove();
						}

						$(document).off( 'click.dtb-collection' );
					}
				} );
			}, 10 );
		},
		background: true,
		backgroundClassName: 'dt-button-background',
		fade: true
	},
	copy: {
		text: 'Copy',
		className: 'buttons-copy',
		action: function ( e, dt, button, config ) {

		}
	},
	csv: {
		text: 'CSV',
		className: 'buttons-csv',
		action: function ( e, dt, button, config ) {

		}
	},
	pdf: {
		text: 'PDF',
		className: 'buttons-pdf',
		action: function ( e, dt, button, config ) {

		}
	},
	print: {
		text: 'Print',
		className: 'buttons-print',
		action: function ( e, dt, button, config ) {

		}
	}
} );



$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables 1.10 API
DataTable.Api.register( 'buttons()', function () {

} );


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtb', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( settings.oInit.buttons ||
		 DataTable.defaults.buttons
	) {

	}
} );


DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons || {};
		return new Buttons( api, opts ).node();
	},
	cFeature: "B"
} );

return Buttons;
}; // /factory


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
	define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery && !jQuery.fn.dataTable.Buttons ) {
	// Otherwise simply initialise as normal, stopping multiple evaluation
	factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);

