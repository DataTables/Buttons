describe('buttons - button().node()', function() {
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
			expect(typeof table.button().node).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.button(0).node() instanceof $).toBe(true);
		});
	});

	describe('Functional tests', function() {
		var table;
		dt.html('basic');
		it('Returns first node', function() {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first', enabled: false }, { text: 'second' }]
			});

			var node = table.button(0).node();

			expect(node.text()).toBe('first');
			expect(node.hasClass('disabled')).toBe(true);
		});
		it('Returns second node', function() {
			var node = table.button(1).node();

			expect(node.text()).toBe('second');
			expect(node.hasClass('disabled')).toBe(false);
		});
	});
});
