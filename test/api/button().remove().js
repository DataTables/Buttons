describe('buttons - button().remove()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Ensure its a function', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});
			expect(typeof table.button().remove).toBe('function');
		});
		it('Returns an API instance', function () {
			table.button().add(null, {
				text: '1'
			});
			expect(table.button(0).remove() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Single Group', function () {
		dt.html('basic');
		it('Single button added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});

			expect(table.buttons().count()).toBe(1);
			table.button(0).remove();
			expect(table.buttons().count()).toBe(0);
		});

		dt.html('basic');
		it('Two buttons added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }, { text: 'second' }]
			});

			expect(table.buttons().count()).toBe(2);
			expect(table.button(0).text()).toBe('first');

			table.button(0).remove();

			expect(table.buttons().count()).toBe(1);
			expect(table.button(0).text()).toBe('second');
		});

		dt.html('basic');
		it('Single button added by API', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, { text: 'first' });
			expect(table.buttons().count()).toBe(1);
			table.button(0).remove();
			expect(table.buttons().count()).toBe(0);
		});

		dt.html('basic');
		it('Single button added by API', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, { text: 'first' });
			table.button().add(1, { text: 'second' });

			expect(table.buttons().count()).toBe(2);
			expect(table.button(0).text()).toBe('first');

			table.button(0).remove();

			expect(table.buttons().count()).toBe(1);
			expect(table.button(0).text()).toBe('second');
		});
	});

	describe('Collections', function () {
		dt.html('basic');
		it('Added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'collection',
						text: 'Table control',
						buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }]
					}
				]
			});

			expect(table.buttons().count()).toBe(4);
			expect(table.button('0-1').text()).toBe('second');

			table.button('0-0').remove();

			expect(table.buttons().count()).toBe(3);
			expect(table.button('0-1').text()).toBe('third');
		});

		dt.html('basic');
		it('Added by API', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, {
				extend: 'collection',
				text: 'Table control',
				buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }]
			});

			expect(table.buttons().count()).toBe(4);
			expect(table.button('0-1').text()).toBe('second');

			table.button('0-0').remove();

			expect(table.buttons().count()).toBe(3);
			expect(table.button('0-1').text()).toBe('third');
		});
	});

	describe('Multiple Groups', function () {
		dt.html('basic');
		it('Added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: {
					buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }],
					name: 'first'
				}
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'second',
				buttons: [{ text: 'one' }, { text: 'two' }, { text: 'three' }]
			});

			table.buttons('second', null).container().appendTo('body');

			expect(table.buttons('first', null).count()).toBe(3);
			expect(table.button('first', 0).text()).toBe('first');

			expect(table.buttons('second', null).count()).toBe(3);
			expect(table.button('second', 0).text()).toBe('one');
		});
		it('Remove a button from the second group', function () {
			table.button('second', 0).remove();

			expect(table.buttons('first', null).count()).toBe(3);
			expect(table.button('first', 0).text()).toBe('first');

			expect(table.buttons('second', null).count()).toBe(2);
			expect(table.button('second', 0).text()).toBe('two');
		});
		it('Remove a button from the first group', function () {
			table.button('first', 0).remove();

			expect(table.buttons('first', null).count()).toBe(2);
			expect(table.button('first', 0).text()).toBe('second');

			expect(table.buttons('second', null).count()).toBe(2);
			expect(table.button('second', 0).text()).toBe('two');
		});

		it('Destroy the table so that the defaults will be reset', function () {
			table.destroy();
		});
	});
});
