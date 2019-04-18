describe('Buttons - options - buttons.init', function() {
	let params = undefined;
	let count = 0;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Button present if no init set', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						init: function() {
							params = arguments;
							count++;
						}
					},
					{ text: 'second' }
				]
			});
			expect($('button.dt-button:eq(1)').text()).toBe('second');
		});
		it('Init called only for those buttons where specified', function() {
			expect(count).toBe(1);
		});
		it('Init function called with correct params', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[1] instanceof $).toBe(true);
			expect(params[2].text).toBe('first');
		});
	});
});
