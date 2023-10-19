describe('buttons - button().action()', function() {
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
			expect(typeof table.button().action).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.button(0).action(function test() {}) instanceof $.fn.dataTable.Api).toBe(true);
		});

		dt.html('basic');
		it('Passes the expected parameters', function() {
			var args;
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'test',
						action: function() {
							args = arguments;
						}
					}
				]
			});

			$('.dt-button').click();

			expect(args.length).toBe(5);
			expect(typeof args[0]).toBe('object');
			expect(args[1] instanceof $.fn.dataTable.Api).toBe(true);
			expect(args[2] instanceof $).toBe(true);
			expect(typeof args[3]).toBe('object');
			expect(args[3].text).toBe('test');
			expect(typeof args[4]).toBe('function');
		});
	});

	describe('Functional tests', function() {
		var count = 0;
		dt.html('basic');
		it('Returns undefined if no action', function() {
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

			expect(table.button(0).action()).toBe(undefined);
		});
		it('Returns function if one set', function() {
			expect(typeof table.button(1).action()).toBe('function');
		});
		it('Does nothing if other button pressed', function() {
			$('.dt-button:first').click();
			expect(count).toBe(0);
		});
		it('Does stuff if pressed', function() {
			$('.dt-button:eq(1)').click();
			expect(count).toBe(1);
		});
		it('Changing action removes initial action', function() {
			var fred = 0;
			table.button(1).action(function() {
				fred++;
			});
			$('.dt-button:eq(1)').click();
			expect(count).toBe(1);
			expect(fred).toBe(1);
		});
	});
});
