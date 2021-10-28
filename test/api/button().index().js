describe('buttons - button().index()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	var table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Ensure its a function', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{text: 'first'}]
			});
			expect(typeof table.button().index).toBe('function');
		});
		it('Returns null if no instance', function () {
			expect(table.button(2).index()).toBe(null);
		});
		it('Returns index if an instance', function () {
			expect(table.button(0).index()).toBe('0');
		});
	});

	describe('Single Group', function () {
		dt.html('basic');
		it('Buttons at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{text: 'first'}]
			});

			expect(table.button().index()).toBe('0');
			expect(table.button(0).index()).toBe('0');
		});
		it('Add a new button', function () {
			table.button().add(null, {
				text: 'second'
			});

			expect(table.button(1).index()).toBe('1');
		});
	});

	describe('Collections', function () {
		dt.html('basic');
		it('Create DataTable with no buttons', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'collection',
						text: 'Table control',
						buttons: [{text: 'first'}]
					}
				]
			});
			expect(table.button().index()).toBe('0');
			expect(table.button(0).index()).toBe('0');
			expect(table.button('0-0').index()).toBe('0-0');
		});
		it('Add to the collection', function () {
			table.button().add('0-0', {
				text: 'second'
			});

			expect(table.button('0-0').index()).toBe('0-0');
			expect(table.button('0-1').index()).toBe('0-1');
		});
	});

	describe('Multiple Groups', function () {
		dt.html('basic');
		it('Create DataTable with two button groups', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: {
					buttons: [],
					name: 'first'
				}
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'second',
				buttons: []
			});

			table.buttons('second', null).container().appendTo('body');
		});
		it('Add a button to the second group', function () {
			table.button('second', null).add(null, {
				text: '1'
			});
			expect(table.button('second', null).index()).toBe('0');
		});
		it('Add a button to the first group', function () {
			table.button('first', null).add(null, {
				text: '2'
			});

			expect(table.button('second', null).index()).toBe('0');
			expect(table.button('first', null).index()).toBe('0');
		});
		it('Add a second button to the first group', function () {
			table.button('first', null).add(null, {
				text: '3'
			});

			expect(table.button('second', null).index()).toBe('0');
			expect(table.button('first', null).index()).toBe('0');
			expect(table.button('first', 1).index()).toBe('1');
		});

		it('Destroy the table so that the defaults will be reset', function() {
			table.destroy();
		});
	});
});
