describe('buttons - button()', function() {
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
			expect(typeof table.button).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.button() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - button-selector', function() {
		dt.html('basic');
		it('Check buttons activity on initialsation', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{ text: 'button1', name: 'first' },
					{ text: 'button2', name: 'second' },
					{ extend: 'colvis', name: 'third', className: 'group' }
				]
			});
		});
		it('null', function() {
			expect(table.button(null).text()).toBe('button1');
		});
		it('integer', function() {
			expect(table.button(1).text()).toBe('button2');
		});
		it('d-d', function() {
			expect(table.button('2-2').text()).toBe('Office');
		});
		it('string:name', function() {
			expect(table.button('first:name').text()).toBe('button1');
		});
		it('string', function() {
			expect(table.button('.group').text()).toBe('Column visibility');
		});
		it('jQuery', function() {
			expect(table.button($('button.dt-button:eq(1)')).text()).toBe('button2');
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
			expect(table.button().text()).toBe('Column visibility');
		});
		it('integer', function() {
			expect(table.button(0, 0).text()).toBe('Column visibility');
			expect(table.button(1, 0).text()).toBe('button1');
			expect(table.button(1, 1).text()).toBe('button2');
		});
		it('string', function() {
			expect(table.button('test_custom', 'first:name').text()).toBe('button1');
		});
	});
});
