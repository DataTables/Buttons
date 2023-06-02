describe('buttons - columnToggle', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure correct number of buttons', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['columnToggle']
			});
			expect($('button.buttons-columnVisibility').length).toBe(1);
			expect($('button.dt-button-active').length).toBe(1);
		});
		it('Contains the expected text', function() {
			expect($('button.buttons-columnVisibility').text()).toBe('Name');
		});
		it('Pressing button makes it inactive', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.buttons-columnVisibility:not(.dt-button-active)').text()).toBe('Name');
		});
		it('And hides all columns', function() {
			expect($('thead th').length).toBe(0);
		});
		it('Pressing again has the opposite effect', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.dt-button-active').length).toBe(1);
			expect($('thead th').length).toBe(6);
		});
	});

	describe('Functional tests - options', function() {
		dt.html('basic');
		it('className', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'columnToggle',
						className: 'unit_test'
					}
				]
			});
			expect($('button.buttons-columnVisibility.unit_test').length).toBe(1);
		});

		dt.html('basic');
		it('Specific columns', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'columnToggle',
						columns: [1, 3]
					}
				]
			});
			expect($('button.buttons-columnVisibility').length).toBe(1);
			expect($('button.dt-button-active').length).toBe(1);
		});
		it('Contains the expected text', function() {
			expect($('button.buttons-columnVisibility').text()).toBe('Position');
		});
		it('Pressing button makes it inactive', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.dt-button-active').length).toBe(0);
		});
		it('And hides the expected columns', function() {
			expect($('thead th').length).toBe(4);
			expect($('thead th').text()).toBe('NameOfficeStart dateSalary');
		});

		dt.html('basic');
		it('text', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'columnToggle',
						text: 'unit_test'
					}
				]
			});
			expect($('button.buttons-columnVisibility').text()).toBe('unit_test');
		});

		dt.html('basic');
		it('Visibility - false (hides)', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'columnToggle',
						columns: 1,
						visibility: false
					}
				]
			});
			expect($('button.buttons-columnVisibility').text()).toBe('Position');
			expect($('button.dt-button-active').length).toBe(1);
		});
		it('Pressing button makes it inactive', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.dt-button-active').length).toBe(0);
		});
		it('And hides the expected columns', function() {
			expect($('thead th').length).toBe(5);
			expect($('thead th').text()).toBe('NameOfficeAgeStart dateSalary');
		});
		it('Pressing button again does nothing', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.dt-button-active').length).toBe(0);
			expect($('thead th').text()).toBe('NameOfficeAgeStart dateSalary');
		});

		dt.html('basic');
		it('Visibility - true (shows)', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				columnDefs: [
					{
						targets: [1, 2],
						visible: false
					}
				],
				buttons: [
					{
						extend: 'columnToggle',
						columns: 1,
						visibility: true
					}
				]
			});
			expect($('button.buttons-columnVisibility').text()).toBe('Position');

			// This is backwards, but no such a minor point not worth raising
			expect($('button.dt-button-active').length).toBe(0);
		});
		it('Pressing button makes it active', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.dt-button-active').length).toBe(1);
		});
		it('And shows the expected column', function() {
			expect($('thead th').length).toBe(5);
			expect($('thead th').text()).toBe('NamePositionAgeStart dateSalary');
		});
		it('Pressing button again does nothing', function() {
			$('button.buttons-columnVisibility').click();
			expect($('button.dt-button-active').length).toBe(1);
			expect($('thead th').text()).toBe('NamePositionAgeStart dateSalary');
		});
	});
});
