describe('buttons - pageLength', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	function checkOptions(count, text, options = []) {
		expect($('.buttons-page-length').length).toBe(1);
		expect($('button.buttons-collection span:first').text()).toBe(text);
		if (options.length > 0) {
			for (let i = 0; i < options.length; i++) {
				expect($('div.dt-button-collection button.button-page-length:eq(' + i + ')').text()).toBe(options[i]);
			}
		}
	}

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Ensure looks as expected', function () {
			$.fx.off = true; // disables lightbox animation
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['pageLength']
			});
			checkOptions(1, 'Show 10 rows');
		});
		it('Contains the expected pages', function () {
			$('.buttons-page-length').click();
			checkOptions(5, 'Show 10 rows', ['10', '25', '50', '100']);
		});
		it('Clicking button changes the length', function () {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(25);
			checkOptions(1, 'Show 25 rows');
		});
		it('Ensure full button text is correct', async function () {
			$('.buttons-page-length').click();
			await dt.sleep(250);
			$('div.dt-button-collection button:eq(2)').click();
			expect($('button.buttons-collection').text()).toBe('Show 50 rows▼');
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Change page menu options', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				lengthMenu: [2, 4, 8],
				buttons: ['pageLength']
			});
			checkOptions(1, 'Show 2 rows');
		});
		it('Contains the expected pages', function() {
			$('.buttons-page-length').click();
			checkOptions(4, 'Show 2 rows', ['2', '4', '8']);
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(4);
			checkOptions(1, 'Show 4 rows');
		});

		dt.html('basic');
		it('length menu with display options', function() {
			$('#example').DataTable({
				dom: 'Bfrtipl',
				lengthMenu: [[2, 4, 8], ['Couple', 'A few', 'More']],
				buttons: ['pageLength']
			});
			checkOptions(1, 'Show 2 rows');
		});
		it('Contains the expected pages', function() {
			$('.buttons-page-length').click();
			checkOptions(4, 'Show 2 rows', ['Couple', 'A few', 'More']);
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(4);
			checkOptions(1, 'Show 4 rows');
		});

		dt.html('basic');
		it('length menu with display options', function() {
			$('#example').DataTable({
				dom: 'Bfrtipl',
				buttons: [
					{
						extend: 'pageLength',
						text: 'Test Text'
					}
				]
			});
			checkOptions(1, 'Test Text');
		});
		it('Contains the expected pages',  function() {
			$('.buttons-page-length').click();
			checkOptions(5, 'Test Text', ['10', '25', '50', '100']);
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(25);
			checkOptions(1, 'Test Text');
		});
	});
});
