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

			expect($('div.dt-buttons button.disabled').length).toBe(0);
		});
		it('Use enable to disable', function() {
			table.button(0).enable(false);

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('first');
		});
		it('Use enable to enable', function() {
			table.button(0).enable(true);

			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe(undefined);
			expect($('div.dt-buttons button.disabled').length).toBe(0);
		});
		it('Disable again', function() {
			table.button(0).enable(false);

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('first');
		});
		it('Use enable to enable with default setting', function() {
			table.button(0).enable();

			expect($('div.dt-buttons button.disabled').length).toBe(0);
		});
	});

	describe('Split buttons', function() {
		var table;

		dt.html('basic');

		it('Main button is enabled', function() {
			table = $('#example').DataTable({
				layout: {
					topStart: {
						buttons: [{
							text: 'main',
							split: [{
								text: 'sub'
							}]
						}]
					}
				}
			});

			expect($('button.dt-button').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Split button is disabled', function() {
			expect($('button.dt-button-split-drop').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Disable main button', function() {
			table.button(0).disable();
			expect($('button.dt-button').eq(0).hasClass('disabled')).toBe(true);
		});

		it('Does not disable the split', function() {
			expect($('button.dt-button-split-drop').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Reenable main button', function() {
			table.button(0).enable();
			expect($('button.dt-button').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Does not change the split', function() {
			expect($('button.dt-button-split-drop').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Disable the button in the split - does not change the main button', function() {
			table.button('0-0').disable();
			expect($('button.dt-button').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Has changed the split', function() {
			expect($('button.dt-button-split-drop').eq(0).hasClass('disabled')).toBe(true);
		});

		it('Reenable the button in the split - does not change the main button', function() {
			table.button('0-0').enable();
			expect($('button.dt-button').eq(0).hasClass('disabled')).toBe(false);
		});

		it('Has changed the split', function() {
			expect($('button.dt-button-split-drop').eq(0).hasClass('disabled')).toBe(false);
		});
	});
});
