describe('buttons - buttons-processing', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;
	let params;
	let count = 0;
	let processing = false;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Set stuff up', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'processing',
						className: 'processing',
						action: function() {
							this.processing(processing);
						}
					},
					{
						text: 'noprocessing',
						className: 'noprocessing',
						action: function() {
							// Do nothing
						}
					}
				]
			});

			table.on('buttons-processing', function() {
				count++;
				params = arguments;
			});
		});
		it('Not activated if no action', function() {
			$('button.noprocessing').click();
			expect(count).toBe(0);
		});
		it('Activates when button clicked', function() {
			$('button.processing').click();
			expect(count).toBe(1);
		});
		it('Passes the expected parameters', function() {
			expect(params.length).toBe(6);
			expect(params[0] instanceof $.Event).toBe(true);
			expect(typeof params[1]).toBe('boolean');
			expect(params[2] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[3] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[4] instanceof $).toBe(true);
			expect(typeof params[5]).toBe('object');
		});
		it('Activates on the correct button', function() {
			expect(params[2].text()).toBe('processing');
			expect(params[5].text).toBe('processing');
		});
	});

	describe('Fuctional test', function() {
		dt.html('basic');
		it('Set stuff up', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'processing',
						className: 'processing',
						action: function() {
							this.processing(processing);
						}
					}
				]
			});

			table.on('buttons-processing', function() {
				params = arguments;
				count++;
			});

			count = 0;
			processing = true;
		});
		it('Ensure passed the correct value', function() {
			$('button.processing').click();
			expect(params[1]).toBe(true);
			expect(count).toBe(1);
		});
		it('... and when called again', function() {
			processing = false;
			$('button.processing').click();
			expect(params[1]).toBe(false);
			expect(count).toBe(2);
		});
		it('... but not if state unchanged', function() {
			$('button.processing').click();
			expect(count).toBe(2);
		});
	});
});
