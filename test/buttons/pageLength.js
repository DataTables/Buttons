describe('buttons - button().action()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;

	function checkOptions(count, text, options = []) {
		expect($('.buttons-page-length').length).toBe(1);
		expect($('button.buttons-collection').text()).toBe(text);
		if (options.length > 0) {
			for (let i = 0; i < options.length; i++) {
				expect($('div.dt-button-collection button.button-page-length:eq(' + i + ')').text()).toBe(options[i]);
			}
		}
	}

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure looks as expected', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: ['pageLength']
			});
			checkOptions(1, 'Show 10 rows');
		});
		it('Contains the expected pages', async function(done) {
			$('.buttons-page-length').click();
			dt.sleep(1000);
			checkOptions(5, 'Show 10 rows', ['10', '25', '50', '100']);
			done();
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(25);
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
		it('Contains the expected pages', async function(done) {
			$('.buttons-page-length').click();
			dt.sleep(1000);
			checkOptions(4, 'Show 2 rows', ['2', '4', '8']);
			done();
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(4);
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
		it('Contains the expected pages', async function(done) {
			$('.buttons-page-length').click();
			dt.sleep(1000);
			checkOptions(4, 'Show 2 rows', ['Couple', 'A few', 'More']);
			done();
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(4);
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
		it('Contains the expected pages', async function(done) {
			$('.buttons-page-length').click();
			dt.sleep(1000);
			checkOptions(5, 'Test Text', ['10', '25', '50', '100']);
			done();
		});
		it('Clicking button changes the length', function() {
			$('div.dt-button-collection button.button-page-length:eq(1)').click();
			expect($('tbody tr').length).toBe(25);
		});
	});
});
