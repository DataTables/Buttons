describe('buttons - button().enable()', function() {
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
			expect(typeof table.button().enable).toBe('function');
		});
		it('Returns an API instance', function() {
			table.button().disable(null, {
				text: '1'
			});
			expect(table.button(0).enable() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Single Group', function() {
		var table;
		dt.html('basic');
		it('Single button added at initialisation', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});

			expect($('button.disabled').length).toBe(0);
		});
		it('Use enable to disable', function() {
			table.button(0).enable(false);

			expect($('button.disabled').length).toBe(1);
			expect($('button.disabled').attr('disabled')).toBe('disabled');
			expect($('button.disabled').text()).toBe('first');
		});
		it('Use enable to enable', function() {
			table.button(0).enable(true);

			expect($('button.disabled').attr('disabled')).toBe(undefined);
			expect($('button.disabled').length).toBe(0);
		});
		it('Disable again', function() {
			table.button(0).enable(false);

			expect($('button.disabled').length).toBe(1);
			expect($('button.disabled').attr('disabled')).toBe('disabled');
			expect($('button.disabled').text()).toBe('first');
		});
		it('Use enable to enable with default setting', function() {
			table.button(0).enable();

			expect($('button.disabled').length).toBe(0);
		});
	});
});
