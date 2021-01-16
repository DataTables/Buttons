describe('Buttons - options - buttons.available', function() {
	let table;
	let params = undefined;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('All buttons present initially', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						destroy: function() {
							params = arguments;
						}
					},
					{
						text: 'second',
						destroy: function() {
							params = arguments;
						}
					},
					{ text: 'third' }
				]
			});
			expect($('button.dt-button').text()).toBe('firstsecondthird');
		});
		it('Can remove button if no option', function() {
			table.button(2).remove();
			expect(params).toBe(undefined);
			expect($('button.dt-button').text()).toBe('firstsecond');
		});
		it('Can remove button with option', function() {
			table.button(0).remove();
			expect($('button.dt-button').text()).toBe('second');
		});
		it('Destroy function called with correct params', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[1] instanceof $).toBe(true);
			expect(params[2].text).toBe('first');
		});
		it('Called when all buttons removed', function() {
			table.buttons().destroy();
			expect($('button.dt-button').length).toBe(0);
			expect(params[2].text).toBe('second');
		});
	});
});
