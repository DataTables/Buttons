describe('buttons - buttons().collectionRebuild()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Ensure its a function', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests

						extend: 'collection',
						buttons: [{ text: 'first' }]
					},
					{
						extend: 'collection',
						buttons: [{ text: 'second' }]
					}
				]
			});
			expect(typeof table.buttons().collectionRebuild).toBe('function');
		});
		it('Returns an API instance', function () {
			expect(table.buttons(0).collectionRebuild([{ text: 'second' }]) instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests - basic', function () {
		dt.html('basic');
		it('Confirm original button', function () {
			$.fx.off = true; // disables lightbox animation
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests

						extend: 'collection',
						buttons: [{ text: 'first' }]
					},
					{
						extend: 'collection',
						buttons: [{ text: 'second' }]
					}
				]
			});

			$('button.buttons-collection:eq(0)').click();
			expect($('div.dt-button-collection button.dt-button').text()).toBe('first');
		});
		it('Call rebuild', function () {
			table.buttons(0).collectionRebuild([{ text: 'test' }]);
			expect($('div.dt-button-collection button.dt-button').text()).toBe('test');
		});
		it('Other collection not effected', function () {
			$('button.buttons-collection:eq(1)').click();
			expect($('div.dt-button-collection button.dt-button').text()).toBe('second');
		});
	});
});
