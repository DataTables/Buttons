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

function download(ext, type, xhr) {
	// The server should return a Blob, but on the off chance that it doesn't create one from the response
	if(xhr.response instanceof Blob) {
		var url = URL.createObjectURL(xhr.response);
	}
	else {
		url =URL.createObjectURL(new Blob([xhr.response], {type}));
	}

	// Get and set the filename for the download. As default the title of the page will be used if it is not
	//  defined in the data sent to the server. This follows the standard Buttons behaviour.
	var disposition = xhr.getResponseHeader('Content-Disposition')
	var filename= $('#example').DataTable().buttons.exportInfo({filename:'*'}).filename + ext;
	if (disposition && disposition.indexOf('attachment') !== -1) {
		var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		var matches = filenameRegex.exec(disposition);
		if (matches != null && matches[1] && matches[1] !== '"dt_default'+ext+'"') { 
			filename = matches[1].replace(/['"]/g, '');
		}
	}

	// Create an anchor link to trigger the download
	var anchor = $('<a id="dt_download" >download</a>');
	$(anchor).attr('href', url);
	$(anchor).attr('download', filename);
	$(anchor).insertAfter('#example');
	var link = $('a#dt_download');
	link[0].click();
	$(anchor).remove();
}

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
                console.log(win.document);
                win.print();
                win.close();
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

	action: function ( e, dt, button, config ) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {};
		xhr.open('POST', 'http://192.168.234.234:8090/csv');
		xhr.send(parseJSON);
		xhr.onreadystatechange = function() {
			if(this.readyState === 4 && this.status === 200){
				download('.csv', 'text/csv', xhr);
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

DataTable.ext.buttons.html = {
	className: 'buttons-html',

	text: function ( dt ) {
		return dt.i18n( 'buttons.html', 'html' );
	},

	action: function ( e, dt, button, config ) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {};
		xhr.open('POST', 'http://192.168.234.234:8090/html');
		xhr.send(parseJSON)
		xhr.onreadystatechange = function() {
			if(this.readyState === 4 && this.status === 200){
				download('.html', 'text/html', xhr);
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

DataTable.ext.buttons.pdf = {
	className: 'buttons-pdf',

	text: function ( dt ) {
		return dt.i18n( 'buttons.pdf', 'pdf' );
	},

	action: function ( e, dt, button, config ) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob'
		xhr.open('POST', 'http://192.168.234.234:8090/pdf');
		xhr.send(parseJSON)
		xhr.onreadystatechange = function() {
			if(this.readyState === 4 && this.status === 200){
				download('.pdf', 'application/pdf', xhr);
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

DataTable.ext.buttons.excel = {
	className: 'buttons-excel',

	text: function ( dt ) {
		return dt.i18n( 'buttons.excel', 'excel' );
	},

	action: function ( e, dt, button, config ) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'blob'
		xhr.open('POST', 'http://192.168.234.234:8090/excel');
		xhr.send(parseJSON)
		xhr.onreadystatechange = function() {
			if(this.readyState === 4 && this.status === 200){
				download('.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', xhr)
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

DataTable.Api.register('docGen.parse()', function (setJson) {
	if(setJson !== undefined) {
		parseJSON = setJson;
	}
	else {
		parseJSON = JSON.stringify(
			{
				blocks: [parse(this.buttons.exportData(), [])],
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
			}
		);
	}
	return parseJSON
})

return DataTable.Buttons;
}));