describe('buttons - button().add()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Check the defaults', function () {
		var table;
		dt.html('basic');
		it('Ensure its a function', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});
			expect(typeof table.button().add).toBe('function');
		});
		it('Returns an API instance', function () {
			expect(
				table.button().add(null, {
					text: '1'
				}) instanceof $.fn.dataTable.Api
			).toBe(true);
		});
	});

	describe('Single Group', function () {
		var table;
		dt.html('basic');
		it('Create DataTable with no buttons', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			expect(table.buttons().count()).toBe(0);
		});
		it('Add a new button', function () {
			table.button().add(null, {
				text: '1'
			});
			expect(table.buttons().count()).toBe(1);
		});
		it('Insert at index 0 inserts before first button', function () {
			table.button().add(0, {
				text: '2'
			});
			expect(table.buttons().count()).toBe(2);
			expect($('.dt-button:first').text()).toBe('2');
			expect($('.dt-button:eq(1)').text()).toBe('1');
		});
		it('Insert at index 2 inserts after current last button', function () {
			table.button().add(2, {
				text: '3'
			});
			expect(table.buttons().count()).toBe(3);
			expect($('.dt-button:last').text()).toBe('3');
		});
		it('Insert button with a string based button', function () {
			table.button().add(0, 'pageLength');
			expect(table.buttons().count()).toBe(8);
			expect($('.dt-button:first span:first').text()).toBe('Show 10 rows');
		});
		it('Insert function based button', function () {
			table.button().add(0, function () {
				return {text: 'Function'};
			});
			expect(table.buttons().count()).toBe(9);
			expect($('.dt-button:first').text()).toBe('Function');
		});
		it('null will insert on the end', function () {
			table.button().add(null, {
				text: 'Last'
			});
			expect(table.buttons().count()).toBe(10);
			expect($('.dt-button:last').text()).toBe('Last');
		});
		it('add a button without drawing it', function () {
			expect($('.dt-buttons button.dt-button').length).toBe(6);

			table.button().add(
				null,
				{
					text: 'nodraw'
				},
				false
			);

			expect($('.dt-buttons button.dt-button').length).toBe(6);
		});
		it('add a button and draw it', function () {
			expect($('.dt-buttons button.dt-button').length).toBe(6);

			table.button().add(
				null,
				{
					text: 'draw'
				},
				true
			);

			expect($('.dt-buttons button.dt-button').length).toBe(8);
		});
	});

	describe('Collections', function () {
		var table;
		dt.html('basic');
		it('Create DataTable with no buttons', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'collection',
						text: 'Table control',
						buttons: []
					}
				]
			});
			expect(table.buttons().count()).toBe(1);
		});
		it('Add to the collection', function () {
			table.button().add('0-0', {
				text: 'Inside'
			});
			expect(table.buttons().count()).toBe(2);
			expect($('.dt-button').length).toBe(1);
		});
		it('Confirm present', function () {
			$('.buttons-collection').click();
			expect($('.dt-button').length).toBe(2);
			expect($('.dt-button-collection .dt-button').text()).toBe('Inside');
		});
	});

	describe('Multiple Groups', function () {
		var table;
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

			expect(table.buttons('first', null).count()).toBe(0);
			expect(table.buttons('second', null).count()).toBe(0);
		});
		it('Add a button to the second group', function () {
			table.button('second', null).add(null, {
				text: '1'
			});

			expect(table.buttons('first', null).count()).toBe(0);
			expect(table.buttons('second', null).count()).toBe(1);
		});
		it('Add a button to the first group', function () {
			table.button('first', null).add(null, {
				text: '2'
			});

			expect(table.buttons('first', null).count()).toBe(1);
			expect(table.buttons('second', null).count()).toBe(1);

			expect($('.dt-button:first').text()).toBe('2');
			expect($('.dt-button:last').text()).toBe('1');
		});

		it('Destroy the table so that the defaults will be reset', function () {
			table.destroy();
		});
	});
});
