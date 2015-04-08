/* Buttons for DataTables
 * 2015 SpryMedia Ltd - datatables.net/license
 */
(function(window, document, undefined) {


var factory = function( $, DataTable ) {
"use strict";



var Buttons = function( dt, config )
{
	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		subButtons: []
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};

Buttons.prototype = {
	container: function ()
	{
		return this.dom.container;
	},


	disable: function ( idx ) {
		var button = this._indexToButton( idx );
		button.node.addClass( 'disabled' );

		return this;
	},

	enable: function ( idx, flag )
	{
		if ( flag === false ) {
			return this.disable( idx );
		}

		var button = this._indexToButton( idx );
		button.node.removeClass( 'disabled' );

		return this;
	},

	name: function ()
	{
		this.c.name;
	},

	node: function ( idx )
	{
		var button = this._indexToButton( idx );
		return button.node;
	},

	toIndex: function ( node )
	{
		var i, ien, j, jen;
		var buttons = this.s.buttons;
		var subButtons = this.s.subButtons;

		// Loop the main buttons first
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node[0] === node ) {
				return i+'';
			}
		}

		// Then the sub-buttons
		for ( i=0, ien=subButtons.length ; i<ien ; i++ ) {
			for ( j=0, jen=subButtons[i].length ; j<jen ; j++ ) {
				if ( subButtons[i][j].node[0] === node ) {
					return i+'-'+j;
				}
			}
		}
	},

	_indexToButton: function ( idx )
	{
		if ( typeof idx === 'number' ) {
			return this.s.buttons[ idx ];
		}
		else if ( idx.indexOf('-') === -1 ) {
			return this.s.buttons[ idx*1 ];
		}

		var idxs = idx.split('-');
		return this.s.subButtons[ idxs[0]*1 ][ idxs[1]*1 ];
	},


	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		if ( $.inArray( this.c.name, $.map( dtSettings._buttons, function (v) { return v.name; } ) ) !== -1 ) {
			throw 'A button set of this name ('+this.c.name+') is already attached to this table';
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		this._buildButtons( this.c.buttons );
	},


	_buildButtons: function ( buttons, container, collectionCounter )
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

			if ( collectionCounter === undefined ) {
				this.s.buttons.push( {
					node: button,
					conf: conf
				} );
				this.s.subButtons.push( [] );
			}
			else {
				this.s.subButtons[ collectionCounter ].push( {
					node: button,
					conf: conf
				} );
			}

			if ( conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				conf._collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className );

				this._buildButtons( conf.buttons, conf._collection, i );
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
	name: 'main',
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
Buttons.version = '0.0.1-dev';



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


function groupSelector ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== 0 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
}


function buttonSelector ( insts, selector )
{
	var ret = [];
	var run = function ( selector, inst ) {
		var i, ien, j, jen;
		var buttons = [];

		$.each( inst.s.buttons, function (i, v) {
			buttons.push( {
				node: v.node[0],
				name: v.name
			} );
		} );

		$.each( inst.s.subButtons, function (i, v) {
			$.each( v, function (j, w) {
				buttons.push( {
					node: w.node[0],
					name: w.name
				} );
			} );
		} );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				idx: selector
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+\-\d+$/ ) ) {
				// Sub-button index selector
				ret.push( {
					inst: inst,
					idx: selector
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							idx: inst.toIndex( buttons[i].node )
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						idx: inst.toIndex( this )
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					idx: inst.toIndex( nodes[ idx ] )
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
}


// DataTables 1.10 API
// xxx how to handle the case whereby there are multiple button sets for a table
// name them? indexes? if no button set option is passed in, then always assume
// index 0. Buttons can be hosted by one table only (actions could be used to
// modify multiple)
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	return this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var buttonInsts = groupSelector( group, ctx._buttons );

			return buttonSelector( buttonInsts, selector );
		}
	}, true );
} );


DataTable.Api.register( 'buttons().enable()', function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.idx, flag );
	} );
} );

DataTable.Api.register( 'buttons().disable()', function () {
	return this.each( function ( set ) {
		set.inst.disable( set.idx );
	} );
} );


DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

DataTable.Api.register( 'button().enable()', function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.idx, flag );
	} );
} );

DataTable.Api.register( 'button().disable()', function () {
	return this.each( function ( set ) {
		set.inst.disable( set.idx );
	} );
} );

DataTable.Api.register( 'button().node()', function () {
	return this.map( function ( set ) {
		return set.inst.node( set.idx );
	} );
} );

// buttons()
// 
// button()
// 
// button().enable()
// button().disable()
// button().text()
// button().action()
// button().node()


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtb', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

/* xxx
	if ( settings.oInit.buttons ||
		 DataTable.defaults.buttons
	) {

	}
*/
} );


DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons;

		if ( $.isArray( opts ) ) {
			opts = { buttons: opts };
		}

		return new Buttons( api, opts ).container();
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

