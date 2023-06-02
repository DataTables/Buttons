describe('buttons - columnsToggle', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	function checkButtons(text) {
		for (i = 0; i < text.length; i++) {
			expect($('button.buttons-columnVisibility:eq(' + i + ')').text()).toBe(text[i]);
		}
	}

	describe('Functional tests', function() {
		dt.html('basic');
		it('Ensure correct number of buttons', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['columnsToggle']
			});
			expect($('button.buttons-columnVisibility').length).toBe(6);
			expect($('button.dt-button-active').length).toBe(6);
		});
		it('Contains the expected text', function() {
			checkButtons(['Name', 'Position', 'Office', 'Age', 'Start date', 'Salary']);
		});
		it('Pressing button makes it inactive', function() {
			$('button.buttons-columnVisibility:eq(2)').click();
			expect($('button.buttons-columnVisibility:not(.dt-button-active)').text()).toBe('Office');
		});
		it('And hides the expected column', function() {
			expect($('thead th').length).toBe(5);
			expect($('thead th:eq(2)').text()).toBe('Age');
		});

		dt.html('basic');
		it('Ensure button not active if column hidden at initialisation', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['columnsToggle'],
				columnDefs: [{ targets: 1, visible: false }]
			});

			expect($('button.buttons-columnVisibility').length).toBe(6);
			expect($('button.dt-button-active').length).toBe(5);
			expect($('button.buttons-columnVisibility:not(.dt-button-active)').text()).toBe('Position');
		});

		dt.html('basic');
		it('Ensure button not active if column hidden at initialisation', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['columnsToggle'],
				columnDefs: [{ targets: 1, title: 'unit test' }]
			});

			expect($('button.buttons-columnVisibility').length).toBe(6);
			checkButtons(['Name', 'unit test', 'Office', 'Age', 'Start date', 'Salary']);
		});
	});

	describe('Functional tests - options', function() {
		dt.html('basic');
		it('Specific columns', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'columnsToggle',
						columns: [1, 3]
					}
				]
			});
			expect($('button.buttons-columnVisibility').length).toBe(2);
			expect($('button.dt-button-active').length).toBe(2);
		});
		it('Contains the expected text', function() {
			checkButtons(['Position', 'Age']);
		});
		it('Pressing button makes it inactive', function() {
			$('button.buttons-columnVisibility:eq(1)').click();
			expect($('button.buttons-columnVisibility:not(.dt-button-active)').text()).toBe('Age');
		});
		it('And hides the expected column', function() {
			expect($('thead th').length).toBe(5);
			expect($('thead th:eq(3)').text()).toBe('Start date');
		});

		// DD-861 raised - seems whatever the visibility value, it just toggles.
		// Once fixed, add test to click on it and confirm it doesn't toggle
		dt.html('basic');
		it('Visibility - false (hides)', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'columnsToggle',
						visibility: false
					}
				]
			});
			expect($('button.buttons-columnVisibility').length).toBe(6);
			expect($('button.dt-button-active').length).toBe(6);
		});
		it('Contains the expected text', function() {
			checkButtons(['Name', 'Position', 'Office', 'Age', 'Start date', 'Salary']);
		});
	});
});
