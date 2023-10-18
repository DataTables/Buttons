describe('buttons - button().disable()', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Check the defaults', function () {
		var table;
		dt.html('basic');
		it('Ensure its a function', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});
			expect(typeof table.button().disable).toBe('function');
		});
		it('Returns an API instance', function () {
			expect(table.button(0).disable() instanceof $.fn.dataTable.Api).toBe(true);
		});
	});

	describe('Single Group', function () {
		var table;
		dt.html('basic');
		it('Single button added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }]
			});

			expect($('div.dt-buttons button.disabled').length).toBe(0);

			table.button(0).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('first');
		});

		dt.html('basic');
		it('Two buttons added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [{ text: 'first' }, { text: 'second' }]
			});

			table.button(1).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('second');

			table.button(0).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(2);
			expect($('div.dt-buttons button.disabled:first').text()).toBe('first');
		});

		dt.html('basic');
		it('Single button added by API', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, { text: 'first' });

			expect($('div.dt-buttons button.disabled').length).toBe(0);

			table.button(0).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('first');
		});

		dt.html('basic');
		it('Two button added by API', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, { text: 'first' });
			table.button().add(1, { text: 'second' });

			table.button(1).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('second');

			table.button(0).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(2);
			expect($('div.dt-buttons button.disabled:first').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled:first').text()).toBe('first');
		});
	});

	describe('Collections', function () {
		var table;

		dt.html('basic');
		it('Added at initialisation', function () {
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

			table.button('0-0').disable();
			expect($('div.dt-buttons button.disabled').length).toBe(0);

			$('.buttons-collection').click();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('first');
		});

		dt.html('basic');
		it('Added by API', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, {
				extend: 'collection',
				text: 'Table control',
				buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }]
			});

			table.button('0-0').disable();
			expect($('div.dt-buttons button.disabled').length).toBe(0);

			$('.buttons-collection').click();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled').text()).toBe('first');
		});

		dt.html('basic');
		it('Disabling the collection', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: []
			});

			table.button().add(null, {
				extend: 'collection',
				text: 'Table control',
				buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }]
			});

			expect($('.dt-button').length).toBe(1);

			table.button(0).disable();

			$('.buttons-collection').click();

			expect($('.dt-button').length).toBe(1);
			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').attr('disabled')).toBe('disabled');
			expect($('div.dt-buttons button.disabled span:first').text()).toBe('Table control');
		});
	});

	describe('Multiple Groups', function () {
		var table;
		dt.html('basic');
		it('Added at initialisation', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: {
					buttons: [{ text: 'first' }, { text: 'second' }, { text: 'third' }],
					name: 'first'
				}
			});

			new $.fn.dataTable.Buttons(table, {
				name: 'second',
				buttons: [{ text: 'one' }, { text: 'two' }, { text: 'three' }]
			});

			table.buttons('second', null).container().appendTo('body');

			expect(table.buttons('first', null).count()).toBe(3);
			expect(table.button('first', 0).text()).toBe('first');

			expect(table.buttons('second', null).count()).toBe(3);
			expect(table.button('second', 0).text()).toBe('one');
		});
		it('Disable a button from the second group', function () {
			table.button('second', 0).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(1);
			expect($('div.dt-buttons button.disabled').text()).toBe('one');
		});
		it('Disable a button from the first group', function () {
			table.button('first', 1).disable();

			expect($('div.dt-buttons button.disabled').length).toBe(2);
			expect($('div.dt-buttons button.disabled:first').text()).toBe('second');
		});

		it('Destroy the table so that the defaults will be reset', function () {
			table.destroy();
		});
	});
});
