describe('buttons - buttons().container()', function() {
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
			expect(typeof table.buttons().container).toBe('function');
		});
		it('Returns a jQuery instance', function() {
			expect(table.buttons(0, 0).container() instanceof $).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Ensure it returns specified container', function() {
			table = $('#example').DataTable();

			new $.fn.dataTable.Buttons(table, {
				name: 'test1',
				buttons: [{ text: 'button1', name: 'first' }, { text: 'button2', name: 'second' }]
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'test2',
				buttons: [{ text: 'button3', name: 'first' }, { text: 'button4', name: 'second' }]
			});

			table
				.buttons('test1, test2', null)
				.containers()
				.prependTo('#dt-test-loader-container');

			table
				.buttons('test1', null)
				.container()
				.addClass('first');

			expect($('div.first').length).toBe(1);
			expect($('div.first button:eq(0)').text()).toBe('button1');
		});
		it('Ensure it returns another container', function() {
			table
				.buttons('test2', null)
				.container()
				.addClass('second');

			expect($('div.second').length).toBe(1);
			expect($('div.second button:eq(0)').text()).toBe('button3');
		});
		it('Second arg ignored', function() {
			table
				.buttons('test2', 1)
				.container()
				.addClass('third');

			expect($('div.third').length).toBe(1);
			expect($('div.third button:eq(0)').text()).toBe('button3');
		});
		it('Ensure it returns single container', function() {
			table
				.buttons()
				.container()
				.addClass('two');

			expect($('div.two').length).toBe(1);
		});
	});
});
