describe('Buttons - options - buttons.attr', function() {
	let table;
	let params;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Empty if no attr set', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						attr: {
							title: 'title1',
							id: 'id1'
						}
					},
					{
						text: 'second',
						attr: {
							title: 'title2',
							id: 'id2'
						},
						titleAttr: 'notused'
					},
					{ text: 'third' }
				]
			});
			expect($('button.dt-button:eq(2)').attr('title')).toBe(undefined);
		});
		it('Setting overrides titleAttr', function() {
			expect($('button.dt-button:eq(1)').attr('title')).toBe('title2');
		});
		it('Can use the ID', function() {
			expect($('#id1').text()).toBe('first');
		});
	});
});
