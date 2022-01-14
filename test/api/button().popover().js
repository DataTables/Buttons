describe('buttons - button().popover()', function() {
	var table;

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
			expect(typeof table.button().popover).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.button(0).popover() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional Tests', function() {
		dt.html('basic');

		it('Simple table with 4 custom buttons', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'test',
						action: function(e) {
							e.stopPropagation();
							this.popover('<div>unittest text</div>', {
								popoverTitle: 'unittest title'
							});
						}
					}
				]
			});

			expect(table.buttons().count()).toBe(1);
			expect($('div.dt-button-collection').length).toBe(0);
		});
		it('Popover is displayed', function() {
			$('button.dt-button').click();
			expect($('div.dt-button-collection').length).toBe(1);
		});
		it('Popover contains expected text', function() {
			expect($('div.dt-button-collection-title').text()).toBe('unittest title');
			expect($('div.dt-button-collection div:eq(2)').text()).toBe('unittest text');
		});
		it('Popover can be removed', function(done) {
			setTimeout(function() {
				$('table').click();
				expect($('div.dt-button-collection').length).toBe(0);
				done();
			}, 100)
		});

		dt.html('basic');
		it('Popover Tests', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'hasClose',
						action: function(e) {
							e.stopPropagation();
							this.popover('<div>unittest text</div>', {
								popoverTitle: 'unittest title'
							});
						}
					},
					{
						text: 'noClose',
						action: function(e) {
							e.stopPropagation();
							this.popover('<div>unittest text</div>', {
								closeButton: false
							});
						}
					}
				]
			});

			expect(table.buttons().count()).toBe(2);
			expect($('div.dt-button-collection').length).toBe(0);
		});
		it('Popover is displayed with close button', function() {
			$('button.dt-button:eq(0)').click();
			expect($('div.dt-button-collection').length).toBe(1);
			expect($('div.dtb-popover-close').length).toBe(1);
		});
		it('Popover can be closed using close button', function(done) {
			setTimeout(function() {
				$('div.dtb-popover-close').click();
				expect($('div.dt-button-collection').length).toBe(0);
				done();
			})
		});
		it('Popover is displayed without close button', function() {
			$('button.dt-button:eq(1)').click();
			expect($('div.dt-button-collection').length).toBe(1);
			expect($('div.dtb-popover-close').length).toBe(0);
		});
		it('Popover can still be closed by clicking outside', function(done) {
			setTimeout(function() {
				$('table').click();
				expect($('div.dt-button-collection').length).toBe(0);
				done();
			})
		});
	});
});
