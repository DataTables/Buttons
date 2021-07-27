describe('Buttons - options - buttons.text', function() {
	let table;
	let params;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Empty if no text set', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{ name: 'first' },
					{ name: 'second', text: 'button2' },
					{ name: 'third', extend: 'pageLength' },
					{
						name: 'fourth',
						text: function() {
							params = arguments;
							return 'unit test';
						}
					}
				]
			});
			expect($('button.dt-button:eq(0)').text()).toBe('');
		});
		it('Otherwise uses setting', function() {
			expect($('button.dt-button:eq(1)').text()).toBe('button2');
		});
		it('Extending uses original text', function() {
			expect($('button.dt-button:eq(2) span:first').text()).toBe('Show 10 rows');
		});
		it('Can also be a function', function() {
			expect($('button.dt-button:eq(3)').text()).toBe('unit test');
		});
		it('Function passed correct params', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[1] instanceof $).toBe(true);
			expect(params[2].name).toBe('fourth');
		});
	});
});
