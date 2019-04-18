describe('Buttons - options - buttons.available', function() {
	let params;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Button present if available not set', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						available: function() {
							params = arguments;
							return true;
						}
					},
					{
						text: 'second',
						available: function() {
							return false;
						}
					},
					{ text: 'third' }
				]
			});
			expect($('button.dt-button:eq(1)').text()).toBe('third');
		});
		it('Available function called with correct params', function() {
			expect(params.length).toBe(2);
			expect(params[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[1].text).toBe('first');
		});
		it('If true, button present', function() {
			expect($('button.dt-button:eq(0)').text()).toBe('first');
		});
		it('If false, button not present', function() {
			// note: we checked the strings of the two buttons above
			expect($('button.dt-button').length).toBe(2);
		});
	});
});
