describe('buttons - button().processing()', function() {
	var table;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Check the defaults', function() {
		var table;
		dt.html('basic');
		it('Ensure its a function', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});
			expect(typeof table.button().processing).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(typeof table.button(0).processing()).toBe('boolean');
		});
	});

	describe('Functional Tests', function() {
		dt.html('basic');

		it('Simple table with 4 custom buttons', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }]
			});

			expect(table.buttons().count()).toBe(4);
		});

		it('Processing state of the buttons is disabled', function() {
			expect(table.button(0).processing()).toBe(false);
			expect(table.button(1).processing()).toBe(false);
			expect(table.button(2).processing()).toBe(false);
			expect(table.button(3).processing()).toBe(false);
		});

		it('Enable processing for second button', function() {
			table.button(1).processing(true);

			expect(table.button(0).processing()).toBe(false);
			expect(table.button(1).processing()).toBe(true);
			expect(table.button(2).processing()).toBe(false);
			expect(table.button(3).processing()).toBe(false);
		});

		it('Button has class on it', function() {
			expect($(table.button(1).node()).hasClass('processing')).toBe(true);
		});

		it('Disable processing for second button', function() {
			table.button(1).processing(false);

			expect(table.button(0).processing()).toBe(false);
			expect(table.button(1).processing()).toBe(false);
			expect(table.button(2).processing()).toBe(false);
			expect(table.button(3).processing()).toBe(false);
		});

		it('Class was removed', function() {
			expect($(table.button(1).node()).hasClass('processing')).toBe(false);
		});

		it('Enable processing for all buttons', function() {
			table.buttons().processing(true);

			expect(table.button(0).processing()).toBe(true);
			expect(table.button(1).processing()).toBe(true);
			expect(table.button(2).processing()).toBe(true);
			expect(table.button(3).processing()).toBe(true);
		});

		it('Disable for index 0', function() {
			table.button(0).processing(false);

			expect(table.button(0).processing()).toBe(false);
			expect(table.button(1).processing()).toBe(true);
			expect(table.button(2).processing()).toBe(true);
			expect(table.button(3).processing()).toBe(true);
		});

		it('Disable for all', function() {
			table.buttons().processing(false);

			expect(table.button(0).processing()).toBe(false);
			expect(table.button(1).processing()).toBe(false);
			expect(table.button(2).processing()).toBe(false);
			expect(table.button(3).processing()).toBe(false);
		});
	});
});
