describe('buttons - colvisGroup', function() {
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
				buttons: [
					{
						extend: 'colvisGroup',
						text: 'Unit Test',
						className: 'unit_test',
						hide: [0, 1],
						show: [4, 5]
					}
				]
			});
			expect($('button.buttons-colvisGroup').length).toBe(1);
		});
		it('Contains the expected text', function() {
			expect($('button.buttons-colvisGroup').text()).toBe('Unit Test');
		});
		it('Contains the expected class', function() {
			expect($('button.buttons-colvisGroup').hasClass('unit_test')).toBe(true);
		});
		it('Confirm starting visibility', function() {
			expect($('thead th').length).toBe(6);
			expect($('thead th').text()).toBe('NamePositionOfficeAgeStart dateSalary');
		});
		it('Pressing button changes visibility', function() {
			$('button.buttons-colvisGroup').click();
			expect($('thead th').length).toBe(4);
			expect($('thead th').text()).toBe('OfficeAgeStart dateSalary');
		});
		it('Pressing button again changes nothing', function() {
			$('button.buttons-colvisGroup').click();
			expect($('thead th').length).toBe(4);
			expect($('thead th').text()).toBe('OfficeAgeStart dateSalary');
		});
		it('Change visibility', function() {
			table.column(1).visible(true);
			table.column(5).visible(false);
			expect($('thead th').length).toBe(4);
			expect($('thead th').text()).toBe('PositionOfficeAgeStart date');
		});
		it('Pressing button changes visibility', function() {
			$('button.buttons-colvisGroup').click();
			expect($('thead th').length).toBe(4);
			expect($('thead th').text()).toBe('OfficeAgeStart dateSalary');
		});
	});
});
