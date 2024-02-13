describe('buttons - colvis', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure correct number of buttons', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['colvis']
			});
			expect($('button.buttons-colvis').length).toBe(1);
		});
		it('Contains the expected text', function() {
			expect($('button.buttons-colvis span:first').text()).toBe('Column visibility');
		});
		it('Pressing button shows the collection', function() {
			$('button.buttons-colvis').click();
			expect($('button.buttons-columnVisibility').length).toBe(6);
		});
		it('All buttons are active', function() {
			expect($('button.buttons-columnVisibility.dt-button-active').length).toBe(6);
		});
		it('Button text is as expected', function() {
			expect($('button.buttons-columnVisibility').text()).toBe('NamePositionOfficeAgeStart dateSalary');
		});
		it('Pressing buttons in collection keeps collection open', function() {
			$('button.buttons-columnVisibility:eq(1)').click();
			expect($('button.buttons-columnVisibility').length).toBe(6);
		});
		it('Pressed button no longer active', function() {
			expect($('button.buttons-columnVisibility:not(.dt-button-active)').length).toBe(1);
			expect($('button.buttons-columnVisibility:not(.dt-button-active)').text()).toBe('Position');
		});
		it('Pressing colvis closes the collection', function() {
			$('button.buttons-colvis').click();
			expect($('button.buttons-columnVisibility').length).toBe(0);
		});
		it('Column correctly hidden', function() {
			expect($('thead th').length).toBe(5);
			expect($('thead th').text()).toBe('NameOfficeAgeStart dateSalary');
		});
		it('Can do two operations while collection open', function() {
			$('button.buttons-colvis').click();
			$('button.buttons-columnVisibility:eq(1)').click();
			$('button.buttons-columnVisibility:eq(4)').click();
			expect($('button.buttons-columnVisibility').length).toBe(6);
		});
		it('When closed, expected visibility changes applied', function() {
			$('button.buttons-colvis').click();
			expect($('thead th').length).toBe(5);
			expect($('thead th').text()).toBe('NamePositionOfficeAgeSalary');
		});
	});

	describe('Functional tests', function() {
		let params = undefined;

		dt.html('basic');
		it('Ensure correct number of buttons', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'colvis',
						text: 'Unit Test',
						className: 'unit_test',
						columns: [2, 4]
					}
				]
			});
			expect($('button.buttons-colvis').length).toBe(1);
		});
		it('Contains the expected text', function() {
			expect($('button.buttons-colvis span:first').text()).toBe('Unit Test');
		});
		it('Contains the expected class', function() {
			expect($('button.buttons-colvis').hasClass('unit_test')).toBe(true);
		});
		it('Pressing button shows the collection', function() {
			$('button.buttons-colvis').click();
			expect($('button.buttons-columnVisibility').length).toBe(2);
		});
		it('Buttons in collection do not contain the class', function() {
			expect($('button.unit_test').length).toBe(1);
		});
		it('Button text is as expected', function() {
			expect($('button.buttons-columnVisibility').text()).toBe('OfficeStart date');
		});
		it('Column correctly hidden', function() {
			$('button.buttons-columnVisibility:eq(1)').click();
			$('button.buttons-colvis').click();
			expect($('thead th').length).toBe(5);
			expect($('thead th').text()).toBe('NamePositionOfficeAgeSalary');
		});

		dt.html('basic');
		it('Callback called the right number of times', function() {
			let counter = 0;

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'colvis',
						text: 'Unit Test',
						className: 'unit_test',
						columnText: function() {
							params = arguments;
							counter++;
							return arguments[2] + arguments[1];
						},
						columns: [2, 4]
					}
				]
			});
			expect(counter).toBe(2);
		});
		it('Button text is as expected', function() {
			$('button.buttons-colvis').click();
			expect($('button.buttons-columnVisibility').text()).toBe('Office2Start date4');
		});
		it('Column correctly hidden', function() {
			$('button.buttons-columnVisibility:eq(1)').click();
			$('button.buttons-colvis').click();
			expect($('thead th').length).toBe(5);
			expect($('thead th').text()).toBe('NamePositionOfficeAgeSalary');
		});
	});
});
