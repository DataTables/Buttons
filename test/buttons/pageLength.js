describe('buttons - pageLength', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	function checkOptions(text, options = []) {
		expect($('.buttons-page-length').length).toBe(1);
		expect($('button.buttons-collection span:first').text()).toBe(text);
		expect($('.button-page-length').length).toBe(options.length);
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
			checkOptions('Show 10 rows');
		});
		it('Contains the expected pages', function () {
			$('.buttons-page-length').click();
			checkOptions('Show 10 rows', ['10', '25', '50', '100']);
		});
		it('Clicking button changes the length', async function () {
			await dt.sleep(250);
			$('button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(25);
			checkOptions('Show 25 rows');
		});
		it('Ensure full button text is correct', async function () {
			$('.buttons-page-length').click();
			$('button.button-page-length:eq(2)').click();
			expect($('tbody tr').length).toBe(50);
			expect($('button.buttons-collection').text()).toBe('Show 50 rows▼');
		});
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Change page menu options', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				lengthMenu: [2, 4, 8],
				buttons: ['pageLength']
			});
			checkOptions('Show 2 rows');
		});
		it('Contains the expected pages', async function () {
			await dt.sleep(250);
			$('.buttons-page-length').click();
			checkOptions('Show 2 rows', ['2', '4', '8']);
		});
		it('Clicking button changes the length', async function () {
			await dt.sleep(250);
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(4);
			checkOptions('Show 4 rows');
		});

		dt.html('basic');
		it('length menu with display options for buttons', function () {
			$('#example').DataTable({
				dom: 'Bfrtipl',
				lengthMenu: [
					[2, 4, 8],
					['Couple', 'A few', 'More']
				],
				buttons: ['pageLength']
			});
			checkOptions('Show 2 rows');
		});
		it('Contains the expected pages', async function () {
			await dt.sleep(250);
			$('.buttons-page-length').click();
			checkOptions('Show 2 rows', ['Couple', 'A few', 'More']);
		});
		it('Clicking button changes the length', async function () {
			await dt.sleep(250);
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(4);
			checkOptions('Show 4 rows');
		});

		dt.html('basic');
		it('length menu with different text', function () {
			$('#example').DataTable({
				dom: 'Bfrtipl',
				buttons: [
					{
						extend: 'pageLength',
						text: 'Test Text'
					}
				]
			});
			checkOptions('Test Text');
		});
		it('Contains the expected pages', async function () {
			await dt.sleep(250);
			$('.buttons-page-length').click();
			checkOptions('Test Text', ['10', '25', '50', '100']);
		});
		it('Clicking button changes the length', async function () {
			await dt.sleep(250);
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(25);
			checkOptions('Test Text');
		});
	});
});
