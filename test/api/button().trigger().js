describe('buttons - button().trigger()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Check the defaults', function() {
		var table;
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});
			expect(typeof table.button().trigger).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.button(0).trigger() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		var table;
		var count = 0;
		dt.html('basic');
		it('Does nothing if no action on button', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{ text: 'first' },
					{
						text: 'second',
						action: function() {
							count++;
						}
					}
				]
			});

			table.button(0).trigger();
			expect(count).toBe(0);
		});
		it('Does stuff if action on button', function() {
			table.button(1).trigger();
			expect(count).toBe(1);
		});

		dt.html('basic');
		it('Opens a collection', function() {
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

			expect($('.dt-button').length).toBe(1);
			table.button(0).trigger();
			expect($('.dt-button').length).toBe(4);
		});
	});
});
