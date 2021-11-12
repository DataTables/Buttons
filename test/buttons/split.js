describe('buttons - split', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	// DD-2375
	describe('Functional tests', function () {
		dt.html('basic');
		it('Change page menu options', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'top',
						split: [
							{text: 'one'},
							{text: 'two'}
						]
					}
				]
			});
		});
	});
});
