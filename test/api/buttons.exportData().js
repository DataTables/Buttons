describe('buttons - buttons.exportData()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;
	let defaultData;

	describe('Check the defaults', function() {
		var ret;

		dt.html('basic');
		it('Ensure its a function', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable();
			expect(typeof table.buttons.exportData).toBe('function');
		});
		it('Returns an object', function() {
			defaultData = table.buttons.exportData();
			expect(typeof defaultData).toBe('object');
			expect(Object.keys(defaultData)).toEqual([
				'header',
				'headerStructure',
				'footer',
				'footerStructure',
				'body'
			]);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Get defaults', function() {
			$('#example tbody').append(
				'<tr><td><a href="url">ZZ link name</a></td><td>position&#10new line</td><td>office&gt;</td><td> 99 </td><td>2019/04/16</td><td>$333,333</td></tr>'
			);
			table = $('#example').DataTable({
				columnDefs: [
					{
						targets: 0,
						render: function(data, type, row) {
							return type === 'test' ? 'XX ' + data : data;
						}
					}
				]
			});
			defaultData = table.buttons.exportData();
		});
		it('row-selector - default', function() {
			table = $('#example').DataTable();
			expect(defaultData.body.length).toBe(58);
		});
		it('row-selector - modified', function() {
			var data = table.buttons.exportData({ rows: ':nth-child(odd)' });
			expect(data.body.length).toBe(5);
			expect(data.body[1][0]).toBe('Ashton Cox');
		});
		it('column-selector - default', function() {
			expect(defaultData.body[0].length).toBe(6);
		});
		it('column-selector - modified', function() {
			var data = table.buttons.exportData({ columns: [3, 4, 5] });
			expect(data.body[0].length).toBe(3);
			expect(data.body[2][0]).toBe('66');
		});
		it('selector-modifier - default', function() {
			expect(defaultData.body[0][0]).toBe('Airi Satou');
		});
		it('selector-modifier - modified', function() {
			var data = table.buttons.exportData({ modifier: { order: 'original' } });
			expect(data.body[0][0]).toBe('Tiger Nixon');
		});
		it('orthogonal - default', function() {
			expect(defaultData.body[2][0]).toBe('Ashton Cox');
		});
		it('orthogonal - modified', function() {
			var data = table.buttons.exportData({ orthogonal: 'test' });
			expect(data.body[2][0]).toBe('XX Ashton Cox');
		});
		it('stripHtml - default', function() {
			expect(defaultData.body[57][0]).toBe('ZZ link name');
		});
		it('stripHtml - modified', function() {
			var data = table.buttons.exportData({ stripHtml: false });
			expect(data.body[57][0]).toBe('<a href="url">ZZ link name</a>');
		});
		it('stripNewLines - default', function() {
			expect(defaultData.body[57][1]).toBe('position new line');
		});
		it('stripNewLines - modified', function() {
			var data = table.buttons.exportData({ stripNewlines: false });
			expect(data.body[57][1]).toBe('position\nnew line');
		});
		it('decodeEntities - default', function() {
			expect(defaultData.body[57][2]).toBe('office>');
		});
		it('decodeEntities - modified', function() {
			var data = table.buttons.exportData({ decodeEntities: false });
			expect(data.body[57][2]).toBe('office&gt;');
		});
		it('trim - default', function() {
			expect(defaultData.body[57][3]).toBe('99');
		});
		it('trim - false - modified (DOM source)', function() {
			var data = table.buttons.exportData({ trim: false });
			expect(data.body[57][3]).toBe('99');
		});
		it('trim - true - modified (DOM source)', function() {
			var data = table.buttons.exportData({ trim: true });
			expect(data.body[57][3]).toBe('99');
		});
		it('trim - false - modified (row added through API)', function() {
			table.row
				.add([
					'<a href="url">ZZ link name</a>',
					'position &#10 new line',
					' office2 ',
					' 99 ',
					'2019/04/16',
					'$333,333'
				])
				.draw();
			var data = table.buttons.exportData({ trim: false });
			expect(data.body[58][3]).toBe(' 99 ');
		});
		it('trim - true - modified (row added through API)', function() {
			var data = table.buttons.exportData({ trim: true });
			expect(data.body[58][3]).toBe('99');
		});
		it('format - default', function() {
			expect(defaultData.header[1]).toBe('Position');
		});
		it('format - modified', function() {
			var data = table.buttons.exportData({
				format: {
					header: function(data, colIdx) {
						return colIdx + ': ' + data;
					}
				}
			});
			expect(data.header[1]).toBe('1: Position');
		});
	});
});
