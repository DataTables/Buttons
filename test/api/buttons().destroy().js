describe('buttons - buttons().destroy()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});
			expect(typeof table.buttons().destroy).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.buttons().destroy() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Can remove single container', function() {
			table = $('#example').DataTable();

			new $.fn.dataTable.Buttons(table, {
				name: 'test1',
				buttons: [{ text: 'button1', name: 'first' }, { text: 'button2', name: 'second' }]
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'test2',
				buttons: [{ text: 'button3', name: 'first' }, { text: 'button4', name: 'second' }]
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'test3',
				buttons: [{ text: 'button5', name: 'first' }, { text: 'button6', name: 'second' }]
			});

			table
				.buttons('test1, test2, test3', null)
				.containers()
				.prependTo('#dt-test-loader-container');

			table.buttons('test2', null).destroy();

			expect($('div.dt-buttons').length).toBe(2);
			expect($('div.dt-buttons:eq(0)').text()).toBe(' button1 button2 ');
			expect($('div.dt-buttons:eq(1)').text()).toBe(' button5 button6 ');
		});
		it('Can remove multiple containers', function() {
			table.buttons().destroy();

			expect($('div.dt-buttons').length).toBe(0);
		});
	});
});
