/*!
 * Column visibility buttons for Buttons and DataTables.
 * 2015 SpryMedia Ltd - datatables.net/license
 */

(function($, DataTable) {
"use strict";


$.extend( DataTable.ext.buttons, {
	// A collection of column visibility buttons
	colvis: function ( dt, conf ) {
		return {
			extend: 'collection',
			text: function ( dt ) {
				return dt.i18n( 'buttons.colvis', 'Column visibility' );
			},
			className: 'buttons-colvis',
			buttons: [ {
				extend: 'columnsToggle',
				columns: conf.columns
			} ]
		};
	},

	// Selected columns with individual buttons - toggle column visibility
	columnsToggle: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnToggle',
				columns: idx
			};
		} ).toArray();

		return columns;
	},

	// Single button to toggle column visibility
	columnToggle: function ( dt, conf ) {
		return {
			extend: 'columnVisibility',
			columns: conf.columns
		};
	},

	// Selected columns with individual buttons - set column visibility
	columnsVisibility: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnVisibility',
				columns: idx,
				visibility: conf.visibility
			};
		} ).toArray();

		return columns;
	},

	// Single button to set column visibility
	columnVisibility: {
		columns: null, // column selector
		text: function ( dt, button, conf ) {
			return $(dt.column( conf.columns ).header()).text();
		},
		className: 'buttons-columnVisibility',
		action: function ( e, dt, button, conf ) {
			var col = dt.column( conf.columns );

			col.visible( conf.visibility !== undefined ?
				conf.visibility :
				! col.visible()
			);
		},
		init: function ( dt, button, conf ) {
			var that = this;
			var col = dt.column( conf.columns );

			dt.on( 'column-visibility.dt'+conf.namespace, function (e, settings, column, state) {
				if ( column === conf.columns ) {
					that.active( state );
				}
			} );

			this.active( col.visible() );
		},
		destroy: function ( dt, button, conf ) {
			dt.off( 'column-visibility.dt'+conf.namespace );
		}
	},


	colvisRestore: {
		className: 'buttons-colvisRestore',

		text: function ( dt ) {
			return dt.i18n( 'buttons.colvisRestore', 'Restore visibility' );
		},

		init: function ( dt, button, conf ) {
			conf._visOriginal = dt.columns().indexes().map( function ( idx ) {
				return dt.column( idx ).visible();
			} ).toArray();
		},

		action: function ( e, dt, button, conf ) {
			dt.columns().every( function ( i ) {
				this.visible( conf._visOriginal[ i ] );
			} );
		}
	},


	colvisGroup: {
		className: 'buttons-colvisGroup',

		action: function ( e, dt, button, conf ) {
			dt.columns( conf.show ).visible( true );
			dt.columns( conf.hide ).visible( false );
		},

		show: [],

		hide: []
	}
} );


})(jQuery, jQuery.fn.dataTable);
