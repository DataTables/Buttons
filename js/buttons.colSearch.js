/*!
 * Column searchability buttons for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;

var getColumnsSearchability = function ( dt, columns ) {
	var columnSearchability = {};
	dt.columns( columns ).indexes().toArray().forEach(function ( val ) {
		columnSearchability[val] = dt.column( val ).searchable();
	});
	return columnSearchability;
}

$.extend( DataTable.ext.buttons, {
	// A collection of column searchability buttons
	searchable: function ( dt, conf ) {
		var node = null;

		var _searchableOriginal = getColumnsSearchability( dt, conf.columns );

		var buttonConf = {
			extend: 'collection',
			init: function ( dt, n ) {
				node = n;
			},
			text: function ( dt ) {
				return dt.i18n( 'buttons.searchable', 'Column searchability' );
			},
			className: 'buttons-searchable',
			buttons: [ {
				extend: 'searchableColumnsToggle',
				columns: conf.columns,
				columnText: conf.columnText,
				_searchableOriginal: _searchableOriginal
			} ]
		};

		//Rebuild the collection with the new column structure if columns are reordered
		dt.on( 'column-reorder.dt'+conf.namespace, function (e, settings, details) {
			var buttons = [{
				extend: 'searchableColumnsToggle',
				columns: conf.columns,
				columnText: conf.columnText,
				prefixButtons: conf.prefixButtons,
				postfixButtons: conf.postfixButtons,
				_searchableOriginal: _searchableOriginal
			}];
			dt.button(null, dt.button(null, node).node()).collectionRebuild(buttons);
		});

		return buttonConf;
	},

	// Selected columns with individual buttons - toggle column searchability
	searchableColumnsToggle: function ( dt, conf ) {
		var allButtons = [];
		var prefixButtons;
		var postfixButtons;

		var buttons = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'searchableColumnToggle',
				columns: idx,
				allColumns: conf.columns,
				columnText: conf.columnText
			};
		} ).toArray();

		function addOriginalSearchable (buttons) {
			var res = buttons.map( function (config) {
				if (config.extend === 'searchableRestore') {
					config._searchableOriginal = conf._searchableOriginal;
				}
				return config;
			})
			return res;
		}
		if (conf.prefixButtons) {
			prefixButtons = addOriginalSearchable(conf.prefixButtons);
			allButtons.push(...prefixButtons);
		}

		allButtons.push(...buttons);

		if (conf.postfixButtons) {
			postfixButtons = addOriginalSearchable(conf.postfixButtons);
			allButtons.push(...postfixButtons);
		}

		return allButtons;
	},

	// Single button to toggle column searchability
	searchableColumnToggle: function ( dt, conf ) {
		return {
			extend: 'columnSearchability',
			columns: conf.columns,
			allColumns: conf.allColumns,
			columnText: conf.columnText
		};
	},

	// Single button to set column searchability
	columnSearchability: {
		columns: undefined, // column selector
		text: function ( dt, button, conf ) {
			return conf._columnText( dt, conf );
		},
		className: 'buttons-columnSearchability',
		action: function ( e, dt, button, conf ) {
			var col = dt.columns( conf.columns );
			var curr = col.searchable();
			var searchable = conf.searchability !== undefined ?
				conf.searchability :
				! (curr.length ? curr[0] : false);

			var currSearchability = getColumnsSearchability( dt, conf.allColumns );

			var searchableCnt = 0;

			for (const [key, value] of Object.entries(currSearchability)) {
 				if (value) {
					searchableCnt += 1;
				}
			}

			// Do not allow the last searchable to get deselected
			if ( !searchable && searchableCnt === 1 ) {
				return;
			}

			var allSearchable = searchableCnt === Object.keys(currSearchability).length;
			//If all columns are searchable then turn the first deselection to clear + select
			if (allSearchable && !searchable) {
				dt.columns().every( function () {
					this.searchable( false, true );
				} );
				col.searchable( true );
			}
			else {
				col.searchable( searchable );
			}
		},

		init: function ( dt, button, conf ) {
			var that = this;
			button.attr( 'data-cs-idx', conf.columns );
			dt
				.on( 'column-searchability.dt'+conf.namespace, function (e, settings) {
					if ( ! settings.bDestroying && settings.nTable == dt.settings()[0].nTable ) {
						that.active( dt.column( conf.columns ).searchable() );
					}
				} )
				.on( 'column-reorder.dt'+conf.namespace, function (e, settings, details) {
					// Button has been removed from the DOM
					if ( conf.destroying ) {
						return;
					}

					if ( dt.columns( conf.columns ).count() !== 1 ) {
						return;
					}

					// This button controls the same column index but the text for the column has
					// changed
					that.text( conf._columnText( dt, conf ) );

					// Since its a different column, we need to check its searchability
					that.active( dt.column( conf.columns ).searchable() );
				} );

			this.active( dt.column( conf.columns ).searchable() );
		},
		destroy: function ( dt, button, conf ) {
			dt
				.off( 'column-searchability.dt'+conf.namespace )
				.off( 'column-reorder.dt'+conf.namespace );
		},

		_columnText: function ( dt, conf ) {
			// Use DataTables' internal data structure until this is presented
			// is a public API. The other option is to use
			// `$( column(col).node() ).text()` but the node might not have been
			// populated when Buttons is constructed.
			var idx = dt.column( conf.columns ).index();
			var title = dt.settings()[0].aoColumns[ idx ].sTitle;

			if (! title) {
				title = dt.column(idx).header().innerHTML;
			}

			title = title
				.replace(/\n/g," ")        // remove new lines
				.replace(/<br\s*\/?>/gi, " ")  // replace line breaks with spaces
				.replace(/<select(.*?)<\/select>/g, "") // remove select tags, including options text
				.replace(/<!\-\-.*?\-\->/g, "") // strip HTML comments
				.replace(/<.*?>/g, "")   // strip HTML
				.replace(/^\s+|\s+$/g,""); // trim

			return conf.columnText ?
				conf.columnText( dt, idx, title ) :
				title;
		}
	},

	searchableRestore: {
		className: 'buttons-searchableRestore',

		text: function ( dt ) {
			return dt.i18n( 'buttons.searchableRestore', 'Restore searchable' );
		},

		init: function ( dt, button, conf ) {
			if (!conf._searchableOriginal) {
				conf._searchableOriginal = getColumnsSearchability( dt );
			}
		},

		action: function ( e, dt, button, conf ) {
			var settings = dt.settings()[0];

			for (const [i, searchable] of Object.entries(conf._searchableOriginal)) {
				var idx = dt.colReorder && dt.colReorder.transpose ?
					dt.colReorder.transpose( i, 'toOriginal' ) :
					i;

				dt.column( idx ).searchable( searchable, true );
			}
			DataTable.ext.internal._fnCallbackFire( settings, null, 'column-searchability', [settings] );
		}
	},

} );

DataTable.Api.registerPlural( 'columns().searchable()', 'column().searchable()', function ( searchable, silent ) {
	return this.iterator( 'column', function ( settings, column ) {
		var col = settings.aoColumns[ column ];
		if ( searchable === undefined ) {
			return col.bSearchable;
		}
		else {
			col.bSearchable = searchable;
			if ( !silent ) {
				DataTable.ext.internal._fnCallbackFire( settings, null, 'column-searchability', [settings] );
			}
		}
	} );
});

return DataTable.Buttons;
}));
