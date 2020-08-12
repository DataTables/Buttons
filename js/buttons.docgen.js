/*!
 * Print button for Buttons and DataTables.
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

var parseJSON;

function parse(prevJson, content) {
	content.push({children:[{type:'string', text:$('#example').DataTable().buttons.exportInfo({filename:'*'}).filename, children:[]}], type:'title'});
	let tableNode= {children:[], type: 'table'};
	tableNode.children.push(_addHeader(prevJson.header));
	tableNode.children.push(_addBody(prevJson.body));
	tableNode.children.push(_addFooter(prevJson.footer));
	content.push(tableNode);
	return content;
}

function _addBody(body) {
	let even = false;
	let bodyNode = {children:[], type: 'tbody'};
	for(let point of body){
		let rowNode = {children:[], type: 'tr'};
		if(even) {
			rowNode.style = 'even';
		}
		even = !even;
		for(let cell of point){
			let cellNode = {children:[], type: 'td'};
			cellNode.children.push({children:[], type: 'string', text: cell});
			rowNode.children.push(cellNode);
		}
		bodyNode.children.push(rowNode);
	}

	return bodyNode;
}

function _addFooter(foot) {
	let footNode = {children:[], type: 'tfoot', style:'header'};
	let rowNode = {children:[], type: 'tr'};
	for(let cell of foot){
		let cellNode = {children:[], type: 'th'};
		cellNode.children.push({children:[], type: 'string', text: cell});
		rowNode.children.push(cellNode);
	}
	footNode.children.push(rowNode);

	return footNode;
}

function _addHeader(head) {
	let headNode = {children:[], type: 'thead', style:'header'};
	let rowNode = {children:[], type: 'tr'};
	for(let cell of head){
		let cellNode = {children:[], type: 'th'};
		cellNode.children.push({children:[], type: 'string', text: cell});
		rowNode.children.push(cellNode);
	}
	headNode.children.push(rowNode);

	return headNode;
}

/**
* Sleeps the synchronous code
* @param duration How long to sleep for
*/
function sleep(duration) {
   return new Promise(resolve => {
	   setTimeout(() => {
		   resolve();
	   }, duration);
   });
}

DataTable.ext.buttons.print = {
	className: 'buttons-print',

	text: function ( dt ) {
		return dt.i18n( 'buttons.print', 'Print' );
	},

	action: function ( e, dt, button, config ) {
		var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://192.168.234.234:8090/html');
        xhr.send(parseJSON)
        xhr.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200){
				var win = window.open('', '');
                win.document.write(xhr.response);
				win.document.close();
				$(win.document).ready(function() {
					win.print();
					win.close();
				})
            }
        };
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};

DataTable.ext.buttons.csv = {
	className: 'buttons-csv',

	text: function ( dt ) {
		return dt.i18n( 'buttons.csv', 'csv' );
	},

	action: async function ( e, dt, button, config ) {
		$('#dtst').attr('action', 'http://192.168.234.234:8090/csv')
		var frame = $('<iframe name="hiddenframe" style="display: none;" target="_self"></iframe>').insertAfter($('#dtst'));
		document.getElementById("dtst").submit();
		await sleep(60000);
		$(frame).remove()
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};

DataTable.ext.buttons.html = {
	className: 'buttons-html',

	text: function ( dt ) {
		return dt.i18n( 'buttons.html', 'html' );
	},

	action: async function ( e, dt, button, config ) {
		$('#dtst').attr('action', 'http://192.168.234.234:8090/html')
		var frame = $('<iframe name="hiddenframe" style="display: none;" target="_self"></iframe>').insertAfter($('#dtst'));
		document.getElementById("dtst").submit();
		await sleep(60000);
		$(frame).remove()
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};

DataTable.ext.buttons.pdf = {
	className: 'buttons-pdf',

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'pdf' );
	},

	action: async function ( e, dt, button, config ) {
		$('#dtst').attr('action', 'http://192.168.234.234:8090/pdf')
		var frame = $('<iframe name="hiddenframe" style="display: none;" target="_self"></iframe>').insertAfter($('#dtst'));
		document.getElementById("dtst").submit();
		await sleep(60000);
		$(frame).remove()
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};

DataTable.ext.buttons.excel = {
	className: 'buttons-excel',

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'excel' );
	},

	action: async function ( e, dt, button, config ) {
		$('#dtst').attr('action', 'http://192.168.234.234:8090/excel')
		var frame = $('<iframe name="hiddenframe" style="display: none;" target="_self"></iframe>').insertAfter($('#dtst'));
		document.getElementById("dtst").submit();
		await sleep(60000);
		$(frame).remove()
	},

	title: '*',

	messageTop: '*',

	messageBottom: '*',

	exportOptions: {},

	header: true,

	footer: false,

	autoPrint: true,

	customize: null
};

/**
 * API function to get/set the JSON for the document generator
 * @param setJson is any JSON that is to be set
 * @param options is an object of the same structure taken by `-api buttons.exportData()¬
 */
DataTable.Api.register('docGen.parse()', function (setJson, options = undefined) {
	if(setJson !== undefined) {
		parseJSON = setJson;
	}
	else {
		parseJSON = JSON.stringify(
			{
				blocks: [parse(this.buttons.exportData(options), [])],
				style:{
					font:{
						name: 'Arial',
						size: '12',
						color: 'black'
					},
					refs: {
						header: {
							fill: {
								bgColor: 'navy'
							},
							font:{
								color: 'white',
								size: '14'
							}
						},
						even: {
							fill: {
								bgColor: '#e9e9e9'
							}
						}
					}
				}
			},
			null,
			'\t'
		);
	}
	return parseJSON
})

return DataTable.Buttons;
}));