describe('buttons - buttons()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['colvis']
			});
			expect(typeof table.buttons).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.buttons() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - button-selector', function() {
		dt.html('basic');
		it('Check buttons activity on initialsation', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{ text: 'button1', className: 'custom', name: 'first' },
					{ text: 'button2', className: 'custom', name: 'second' },
					{ extend: 'colvis', name: 'third', className: 'group' }
				]
			});
		});
		it('null', function() {
			expect(table.buttons(null).count()).toBe(9);
		});
		it('integer', function() {
			expect(table.buttons(1).text()[0]).toBe('button2');
		});
		it('d-d', function() {
			expect(table.buttons('2-2').text()[0]).toBe('Office');
		});
		it('string:name', function() {
			expect(table.buttons('first:name').text()[0]).toBe('button1');
		});
		it('string', function() {
			var buttons = table.buttons('.custom');
			expect(buttons.length).toBe(2);
			expect(buttons.text()[0]).toBe('button1');
			expect(buttons.text()[1]).toBe('button2');
		});
		it('jQuery', function() {
			var buttons = table.buttons($('button:not(.custom)'));
			expect(buttons.length).toBe(1);
			expect(buttons.text()[0]).toBe('Column visibility');
		});
		it('Array', function() {
			var buttons = table.buttons([$('button:not(.custom)'), 0]);
			expect(buttons.length).toBe(2);
			expect(buttons.text()[0]).toBe('Column visibility');
			expect(buttons.text()[1]).toBe('button1');
		});
	});

	describe('Functional tests - button-group-selector', function() {
		dt.html('basic');
		it('Check buttons activity on initialsation', function() {
			table = $('#example').DataTable();

			new $.fn.dataTable.Buttons(table, {
				name: 'test_colvis',
				buttons: [{ extend: 'colvis', name: 'first', className: 'group' }]
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'test_custom',
				buttons: [{ text: 'button1', name: 'first' }, { text: 'button2', name: 'second' }]
			});

			table
				.buttons('test_colvis, test_custom', null)
				.containers()
				.prependTo('#dt-test-loader-container');
		});
		it('null', function() {
			expect(table.buttons().length).toBe(9);
		});
		it('integer - first group', function() {
			var buttons = table.buttons(0, 0);
			expect(buttons.length).toBe(1);
			expect(buttons.text()[0]).toBe('Column visibility');
		});
		it('integer - second group', function() {
			var buttons = table.buttons(1, 0);
			expect(buttons.length).toBe(1);
			expect(buttons.text()[0]).toBe('button1');
		});
		it('string - first group', function() {
			var buttons = table.buttons('test_colvis', null);
			expect(buttons.length).toBe(7);
			expect(buttons.text()[0]).toBe('Column visibility');
		});
		it('string - second group', function() {
			var buttons = table.buttons('test_custom', null);
			expect(buttons.length).toBe(2);
			expect(buttons.text()[0]).toBe('button1');
			expect(buttons.text()[1]).toBe('button2');
		});
	});
});
