describe('Buttons - options - buttons.className', function() {
	let params;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Check class on single button', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{ text: 'first', className: 'class1' },
					{ text: 'second', className: 'class2' },
					{ text: 'third', className: 'class1' }
				]
			});
			expect($('button.class2').text()).toBe('second');
		});
		it('Check class on multiple buttons', function() {
			expect($('button.class1').text()).toBe('firstthird');
		});
	});
});
