describe('buttons - spacer', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Empty - no text', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{text: 'one'},
					{
						extend: 'spacer'
					},
					{text: 'two'}
				]
			});

			expect($('.dt-button-spacer').hasClass('bar')).toBe(false);
			expect($('.dt-button-spacer').text()).toBe('');
		});

		dt.html('basic');
		it('Empty - text', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{text: 'one'},
					{
						extend: 'spacer',
						text: 'space'
					},
					{text: 'two'}
				]
			});

			expect($('.dt-button-spacer').hasClass('bar')).toBe(false);
			expect($('.dt-button-spacer').text()).toBe('space');
		});

		dt.html('basic');
		it('Bar - no text', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{text: 'one'},
					{
						extend: 'spacer',
						style: 'bar'
					},
					{text: 'two'}
				]
			});

			expect($('.dt-button-spacer').hasClass('bar')).toBe(true);
			expect($('.dt-button-spacer').text()).toBe('');
		});

		dt.html('basic');
		it('Bar - text', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{text: 'one'},
					{
						extend: 'spacer',
						style: 'bar',
						text: 'space'
					},
					{text: 'two'}
				]
			});

			expect($('.dt-button-spacer').hasClass('bar')).toBe(true);
			expect($('.dt-button-spacer').text()).toBe('space');
		});
	});
});
