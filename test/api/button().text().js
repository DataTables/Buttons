describe('buttons - button().text()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});
			expect(typeof table.button().text).toBe('function');
		});
		it('Getter returns a string', function() {
			expect(typeof table.button(0).text()).toBe('string');
		});
		it('Setter returns an API instance', function() {
			expect(table.button(0).text('fred') instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Returns text two button', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first', enabled: false }, { text: 'second' }]
			});

			expect(table.button(0).text()).toBe('first');
			expect(table.button(1).text()).toBe('second');
		});
		it('Can set the text', function() {
			table.button(1).text('Changed');

			expect(table.button(1).text()).toBe('Changed');
			expect($('.dt-button:eq(1)').text()).toBe('Changed');
		});
		it('Can set text of disabled buttons', function() {
			table.button(0).text('Other');

			expect(table.button(0).text()).toBe('Other');
			expect($('.dt-button:first').text()).toBe('Other');
		});

		dt.html('basic');
		it('Can change collection text', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'collection',
						text: 'Table control',
						buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }]
					}
				]
			});

			table.button(0).text('Collection');

			expect(table.button(0).text()).toBe('Collection');
			expect($('.dt-button:first span:first').text()).toBe('Collection');
		});
		it('Can text of item in collection', function() {
			table.button('0-1').text('Middle');
			table.button(0).trigger();

			expect(table.button('0-1').text()).toBe('Middle');
			expect($('.dt-button-collection .dt-button:eq(1)').text()).toBe('Middle');
		});
	});
});
