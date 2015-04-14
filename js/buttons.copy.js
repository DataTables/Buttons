
(function($, DataTable) {

var Buttons = DataTable.Buttons;
var ZClipboard = Buttons.ZClipboard;

DataTable.ext.buttons.copy = {
	text: 'Copy',

	available: function () {
		// There is simply no HTML5 API that will do a copy to clipboard
		return ZClipboard.hasFlash();
	},

	init: function () {
		// Insert the Flash movie
	},

	action: function ( e, dt, button, config ) {
		// Set the text
	},

	fieldSeparator: '\t',

	fieldQuote: ''
};

})(jQuery, jQuery.fn.dataTable);