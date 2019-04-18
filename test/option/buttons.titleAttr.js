describe('Buttons - options - buttons.titleAttr', function() {
	let params;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Empty if no title set', function() {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{ name: 'first', text: 'button1' },
					{
						name: 'second',
						text: 'button2',
						titleAttr: 'test2'
					},
					{
						name: 'third',
						text: 'button3',
						titleAttr: function() {
							params = arguments;
							return 'test3';
						}
					}
				]
			});
			expect($('button.dt-button:eq(0)').attr('title')).toBe(undefined);
		});
		it('Can use string', function() {
			expect($('button.dt-button:eq(1)').attr('title')).toBe('test2');
		});
		it('Can use function', function() {
			expect($('button.dt-button:eq(2)').attr('title')).toBe('test3');
		});
		it('Function passed correct params', function() {
			expect(params.length).toBe(3);
			expect(params[0] instanceof $.fn.dataTable.Api).toBe(true);
			expect(params[1] instanceof $).toBe(true);
			expect(params[2].name).toBe('third');
		});
	});
});
