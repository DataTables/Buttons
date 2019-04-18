describe('Buttons - options - buttons.enable', function() {
	let table;
	let button = undefined;

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
						enabled: true,
						action: function() {
							button = 'first';
						}
					},
					{
						text: 'second',
						enabled: false,
						action: function() {
							button = 'second';
						}
					},
					{
						text: 'third',
						action: function() {
							button = 'third';
						}
					}
				]
			});
			expect($('button.dt-button').text()).toBe('firstsecondthird');
		});
		it('By default, button enabled', function() {
			expect($('button.dt-button:eq(2)').hasClass('disabled')).toBe(false);
		});
		it('... and clicking it does stuff', function() {
			$('button.dt-button:eq(2)').click();
			expect(button).toBe('third');
		});
		it('If enabled, button enabled', function() {
			expect($('button.dt-button:eq(0)').hasClass('disabled')).toBe(false);
		});
		it('... and clicking it does stuff', function() {
			$('button.dt-button:eq(0)').click();
			expect(button).toBe('first');
		});
		it('If disabled, button disabled', function() {
			expect($('button.dt-button:eq(1)').hasClass('disabled')).toBe(true);
		});
		it('... and clicking it does nothing', function() {
			$('button.dt-button:eq(1)').click();
			expect(button).toBe('first');
		});
	});
});
