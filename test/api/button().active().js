describe('buttons - button().active()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	function checkActive(active) {
		for (let i = 0; i < active.length; i++) {
			expect(table.button(i).active()).toBe(active[i]);
			expect($('div.dt-buttons button.dt-button:eq(' + i + ')').hasClass('dt-button-active')).toBe(active[i]);
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});
			expect(typeof table.button().active).toBe('function');
		});
		it('Getter returns a boolean', function() {
			expect(typeof table.button(0).active()).toBe('boolean');
		});
		it('Setter returns an API instance', function() {
			expect(table.button(0).active(true) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check buttons activity on initialsation', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }, { text: 'second' }, 'colvis']
			});

			checkActive([false, false, false]);
		});
		it('Activate custom button', function() {
			table.button(1).active(true);
			checkActive([false, true, false]);
		});
		it('Activate middle colvis', function() {
			table.button(2).active(true);
			checkActive([false, true, true]);
		});
		it('Deactivate custom button', function() {
			table.button(1).active(false);
			checkActive([false, false, true]);
		});
		it('Deactivate middle colvis', function() {
			table.button(2).active(false);
			checkActive([false, false, false]);
		});
	});
});
