describe('buttons - buttons.info()', function() {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function() {
		dt.html('basic');
		it('Ensure its a function', function() {
			$.fx.off = true; // disables lightbox animation

			table = $('#example').DataTable();
			expect(typeof table.buttons.info).toBe('function');
		});
		it('Returns an API instance', function() {
			expect(table.buttons.info('unit_test') instanceof $.fn.dataTable.Api).toBe(true);
		});
		it('Is removed when table destroyed', function() {
			table.destroy();
			expect($('div.dt-button-info').length).toBe(0);
		});
	});

	describe('Functional tests', function() {
		dt.html('basic');
		it('Info not displayed by default', function() {
			table = $('#example').DataTable();
			expect($('div.dt-button-info').length).toBe(0);
		});
		it('Displayed after being called', function() {
			table.buttons.info('test title', 'test message');
			expect($('div.dt-button-info').length).toBe(1);
		});
		it('Header shows correct text', function() {
			expect($('div.dt-button-info h2').text()).toBe('test title');
		});
		it('Body shows correct text', function() {
			expect($('div.dt-button-info div').text()).toBe('test message');
		});
		it('Can set new message', function() {
			table.buttons.info('second title', 'second message');
			expect($('div.dt-button-info').length).toBe(1);
			expect($('div.dt-button-info h2').text()).toBe('second title');
			expect($('div.dt-button-info div').text()).toBe('second message');
		});
		it('Message remains on screen ...', async function() {
			await dt.sleep(1000);
			expect($('div.dt-button-info').length).toBe(1);
		});
		it('... until instructed to close', function() {
			table.buttons.info(false);
			expect($('div.dt-button-info').length).toBe(0);
		});
		it('... or timeout set at initialisation', async function() {
			table.buttons.info('test title', 'test message', 500);
			expect($('div.dt-button-info').length).toBe(1);
			await dt.sleep(1000);
			expect($('div.dt-button-info').length).toBe(0);
		});
	});
});
