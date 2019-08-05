describe('buttons - buttons-action', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;
	let params;
	let count = 0;
	let action = 0;
	let actionCopy = 0;
	let secondAction = 0;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Set stuff up', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'action',
						className: 'action',
						action: function() {
							action++;
						}
					},
					{
						text: 'secondaction',
						className: 'secondaction',
						action: function() {
							secondAction++;
						}
					},
					{
						text: 'noaction',
						className: 'noaction'
					}
				]
			});

			table.on('buttons-action', function() {
				params = arguments;
				actionCopy = action;
				count++;
			});
		});
		it('Not activated if no action', function() {
			$('button.noaction').click();
			expect(count).toBe(0);
		});
		it('Activates when button clicked', function() {
			$('button.action').click();
			expect(count).toBe(1);
		});
		it('Activates after the action', function() {
			expect(actionCopy).toBe(1);
		});
		it('Passes the expected parameters', function() {
			expect(params.length).toBe(5);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(params[1] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[2] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[3] instanceof $).toBe(true);
			expect(typeof params[4]).toBe('object');
		});
		it('Activates on the correct button', function() {
			expect(params[1].text()).toBe('action');
			expect(params[4].text).toBe('action');
			expect(secondAction).toBe(0);
		});
	});

	describe('Fuctional test', function() {
		dt.html('basic');
		it('Set stuff up', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['colvis']
			});

			table.on('buttons-action', function() {
				params = arguments;
				actionCopy = action;
				count++;
			});

			count = 0;
		});
		it('Get notified for a collection', function() {
			$('button.dt-button').click();
			expect(params[1].text()).toBe('Column visibility');
			expect(count).toBe(1);
		});
		it('... and for its children', function() {
			$('div.dt-button-collection button.dt-button:eq(1)').click();
			expect(params[1].text()).toBe('Position');
			expect(count).toBe(2);
		});
	});
});
