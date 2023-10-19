// note minimal tests as used throughout other tests
describe('Buttons - options - buttons.action', function() {
	let params = undefined;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Button present if no action set', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						action: function() {
							params = arguments;
						}
					},
					{
						text: 'second',
						action: function() {
							params = arguments;
						}
					},
					{ text: 'third' }
				]
			});
			expect($('button.dt-button:eq(2)').text()).toBe('third');
		});
		it('Action called if button pressed?', function() {
			$('button.dt-button:eq(1)').click();
			expect(params).not.toBe(undefined);
		});
		it('Action function called with correct params', function() {
			expect(params.length).toBe(5);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[2] instanceof $).toBe(true);
			expect(params[3].text).toBe('second');
			expect(typeof params[4]).toBe('function');
		});
	});
});
