describe('buttons - colvisRestore', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure correct number of buttons', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['colvisRestore'],
				columnDefs: [
					{
						targets: [1, 2],
						visible: false
					}
				]
			});
			expect($('button.buttons-colvisRestore').length).toBe(1);
		});
		it('Contains the expected text', function() {
			expect($('button.buttons-colvisRestore').text()).toBe('Restore visibility');
		});
		it('Pressing button does nothing if nothing changed', function() {
			expect($('thead th').length).toBe(4);
			$('button.buttons-colvisRestore').click();
			expect($('thead th').length).toBe(4);
		});
		it('Pressing button does stuff if stuff changed', function() {
			table.column(0).visible(false);
			table.column(1).visible(true);
			expect($('thead th').text()).toBe('PositionAgeStart dateSalary');
			$('button.buttons-colvisRestore').click();
			expect($('thead th').length).toBe(4);
			expect($('thead th').text()).toBe('NameAgeStart dateSalary');
		});
	});
});
