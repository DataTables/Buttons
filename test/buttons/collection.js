describe('buttons - collection', function () {
	dt.libs({
		js: ['jquery', 'datatables', 'buttons', 'buttons-colVis'],
		css: ['datatables', 'buttons']
	});

	let table;

	describe('Check the defaults', function () {
		dt.html('basic');
		it('Ensure collection button is as expected', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } }
						]
					}
				]
			});
			expect($('button.dt-button').length).toBe(1);
			expect($('button.buttons-collection').length).toBe(1);
		});
		it('Contains the expected text', function () {
			expect($('button.dt-button span:first').text()).toBe('Collection');
		});
		it('Contains the expected buttons', function () {
			$('button.dt-button').click();
			expect($('button.dt-button').length).toBe(3);
		});
		it('Contains the expected button positioning', function () {
			let first = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(1)').offset().left).toBe(first.left);
			expect($('div.dt-button-collection button:eq(1)').offset().top).toBeGreaterThan(first.left);
		});
		it('Contains the expected collection position', function () {
			let first = $('div.dt-button-collection button:eq(0)').offset();
			expect($('tbody tr:eq(0)').offset().top).toBeGreaterThan(first.left);
		});
		it('Contains the expected background', function () {
			expect($('div.dt-button-background').length).toBe(1);
		});
		it('Contains the expected title', function () {
			expect($('div.dt-button-collection-title').text()).toBe('');
		});
		it('Clicking the button keeps the collection open', function () {
			$('div.dt-button-collection button.dt-button').click();
			expect($('button.dt-button').length).toBe(3);
		});
		it('Collection can be closed', function () {
			$('button.dt-button').click();
			expect($('button.dt-button').length).toBe(1);
		});
	});

	describe('Functional tests - basic', function () {
		dt.html('basic');
		it('align - button-left', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'test', action: function () { } }],
						align: 'button-left'
					}
				]
			});
			$('button.dt-button').click();

			let button = $('button.buttons-collection').offset();
			let collection = $('div.dt-button-collection').offset();

			expect(button.left).toBe(collection.left);
		});

		dt.html('basic');
		it('align - button-right', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'test', action: function () { } }],
						align: 'button-right'
					}
				]
			});
			$('button.dt-button').click();

			let collection = $('div.dt-button-collection').offset();

			expect(collection.left).toBe(0);
		});

		dt.html('basic');
		it('align - container', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'test', action: function () { } }],
						align: 'container'
					}
				]
			});
			$('button.dt-button').click();

			let button = $('button.buttons-collection').offset();
			let collection = $('div.dt-button-collection').offset();

			expect(button.left).toBe(collection.left);
		});

		dt.html('basic');
		it('align - dt-container', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'test', action: function () { } }],
						align: 'dt-container'
					}
				]
			});
			$('button.dt-button').click();

			let button = $('button.buttons-collection').offset();
			let collection = $('div.dt-button-collection').offset();
			let width = $('div.dt-button-collection').width();

			expect(button.left).toBe(collection.left);
			expect(width).toBeGreaterThan(100);
		});

		dt.html('basic');
		it('action', function (done) {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{
								text: 'search',
								action: function () {
									table.search('cox').draw();
								}
							}
						]
					}
				]
			});
			$('button.dt-button').click();
			$('div.dt-button-collection button.dt-button').click();
			setTimeout(function () {
				expect($('tbody tr:eq(0) td:eq(0)').text()).toBe('Ashton Cox');
				done();
			}, 50);
		});

		dt.html('basic');
		it('autoClose - default (false)', function (done) {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{
								text: 'test',
								action: function () { }
							}
						]
					}
				]
			});

			$('button.dt-button').click();

			$('div.dt-button-collection button.dt-button').click();

			setTimeout(function () {
				expect($('button.dt-button').length).toBe(2);
				done();
			}, 50);
		});

		dt.html('basic');
		it('autoClose - true', function (done) {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{
								text: 'null',
								action: function () { }
							}
						],
						autoClose: true
					}
				]
			});
			$('button.dt-button').click();

			setTimeout(function () {
				$('div.dt-button-collection button.dt-button').click();
				setTimeout(function () {
					expect($('button.dt-button').length).toBe(1);
					done();
				}, 50);
			}, 50);
		});

		dt.html('basic');
		it('autoClose - false', function (done) {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{
								text: 'null',
								action: function () { }
							}
						],
						autoClose: false
					}
				]
			});
			$('button.dt-button').click();

			setTimeout(function () {
				$('div.dt-button-collection button.dt-button').click();
				setTimeout(function () {
					expect($('button.dt-button').length).toBe(2);
					done();
				}, 50);
			}, 50);
		});

		dt.html('basic');
		it('background', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						background: false
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-background').length).toBe(0);
		});

		dt.html('basic');
		it('backgroundClassName', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						backgroundClassName: 'test-background-class'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-background').length).toBe(0);
			expect($('div.test-background-class').length).toBe(1);
		});

		dt.html('basic');
		it('className - applies to collection button', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						className: 'test-class'
					}
				]
			});
			expect($('button.test-class').length).toBe(1);
		});
		it('className - does not apply to buttons in the collection', function () {
			$('button.dt-button').click();
			expect($('button.test-class').length).toBe(1);
		});

		dt.html('basic');
		it('collectionLayout - fixed', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } }
						],
						collectionLayout: 'fixed'
					}
				]
			});
			$('button.dt-button').click();
			let first = $('div.dt-button-collection button:eq(0)').offset();
			expect($('tbody tr:eq(0)').offset().top).toBeLessThan(first.left);
		});

		dt.html('basic');
		it('collectionLayout - two-column', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } }
						],
						collectionLayout: 'two-column'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-collection.two-column').length).toBe(1);
		});
		it('collectionLayout - two-column - horizontal position', function () {
			let firstColumn = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(1)').offset().left).toBe(firstColumn.left);

			let secondColumn = $('div.dt-button-collection button:eq(2)').offset();
			expect($('div.dt-button-collection button:eq(3)').offset().left).toBe(secondColumn.left);

			expect(firstColumn.left).toBeLessThan(secondColumn.left);
		});
		it('collectionLayout - two-column - vertical position', function () {
			let firstRow = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().top).toBe(firstRow.top);

			let secondRow = $('div.dt-button-collection button:eq(1)').offset();
			expect($('div.dt-button-collection button:eq(3)').offset().top).toBe(secondRow.top);

			expect(firstRow.top).toBeLessThan(secondRow.top);
		});

		dt.html('basic');
		it('collectionLayout - three-column', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } },
							{ text: 'five', action: function () { } }
						],
						collectionLayout: 'three-column'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-collection.three-column').length).toBe(1);
		});
		it('collectionLayout - three-column - horizontal position', function () {
			let firstColumn = $('div.dt-button-collection button:eq(0)').offset();
			let secondColumn = $('div.dt-button-collection button:eq(2)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().left).toBe(secondColumn.left);
			let thirdColumn = $('div.dt-button-collection button:eq(4)').offset();

			expect(firstColumn.left).toBeLessThan(secondColumn.left);
			expect(secondColumn.left).toBeLessThan(thirdColumn.left);
			expect(secondColumn.left - firstColumn.left).toBe(thirdColumn.left - secondColumn.left);
		});
		it('collectionLayout - three-column - vertical position', function () {
			let firstRow = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().top).toBe(firstRow.top);
			expect($('div.dt-button-collection button:eq(4)').offset().top).toBe(firstRow.top);
			let secondRow = $('div.dt-button-collection button:eq(1)').offset();

			expect(firstRow.top).toBeLessThan(secondRow.top);
		});

		dt.html('basic');
		it('collectionLayout - four-column', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } },
							{ text: 'five', action: function () { } },
							{ text: 'six', action: function () { } },
							{ text: 'seven', action: function () { } }
						],
						collectionLayout: 'four-column'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-collection.four-column').length).toBe(1);
			expect($('div.dt-button-collection.four-column').offset().top).toBeLessThan($('tbody tr:eq(5)').offset().top);
		});
		it('collectionLayout - four-column - horizontal position', function () {
			let firstColumn = $('div.dt-button-collection button:eq(0)').offset();
			let secondColumn = $('div.dt-button-collection button:eq(2)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().left).toBe(secondColumn.left);
			let thirdColumn = $('div.dt-button-collection button:eq(4)').offset();
			let fourthColumn = $('div.dt-button-collection button:eq(6)').offset();

			expect(firstColumn.left).toBeLessThan(secondColumn.left);
			expect(secondColumn.left).toBeLessThan(thirdColumn.left);
			expect(secondColumn.left - firstColumn.left).toBe(thirdColumn.left - secondColumn.left);
			expect(thirdColumn.left).toBeLessThan(fourthColumn.left);
		});
		it('collectionLayout - four-column - vertical position', function () {
			let firstRow = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().top).toBe(firstRow.top);
			expect($('div.dt-button-collection button:eq(4)').offset().top).toBe(firstRow.top);
			let secondRow = $('div.dt-button-collection button:eq(1)').offset();

			expect(firstRow.top).toBeLessThan(secondRow.top);
		});

		dt.html('basic');
		it('collectionLayout - four-column fixed', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } },
							{ text: 'five', action: function () { } },
							{ text: 'six', action: function () { } },
							{ text: 'seven', action: function () { } }
						],
						collectionLayout: 'fixed four-column'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-collection.four-column').length).toBe(1);
			expect($('div.dt-button-collection.four-column').offset().top).toBeGreaterThan($('tbody tr:eq(5)').offset().top);
		});
		it('collectionLayout - four-column - horizontal position', function () {
			let firstColumn = $('div.dt-button-collection button:eq(0)').offset();
			let secondColumn = $('div.dt-button-collection button:eq(2)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().left).toBe(secondColumn.left);
			let thirdColumn = $('div.dt-button-collection button:eq(4)').offset();
			let fourthColumn = $('div.dt-button-collection button:eq(6)').offset();

			expect(firstColumn.left).toBeLessThan(secondColumn.left);
			expect(secondColumn.left).toBeLessThan(thirdColumn.left);
			expect(secondColumn.left - firstColumn.left).toBe(thirdColumn.left - secondColumn.left);
			expect(thirdColumn.left).toBeLessThan(fourthColumn.left);
		});
		it('collectionLayout - four-column - vertical position', function () {
			let firstRow = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(2)').offset().top).toBe(firstRow.top);
			expect($('div.dt-button-collection button:eq(4)').offset().top).toBe(firstRow.top);
			let secondRow = $('div.dt-button-collection button:eq(1)').offset();

			expect(firstRow.top).toBeLessThan(secondRow.top);
		});

		dt.html('basic');
		it('collectionLayout - responsive (columns) fixed', function () {
			$('#dt-test-loader-container').width(1000);

			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } },
							{ text: 'five', action: function () { } },
							{ text: 'six', action: function () { } },
							{ text: 'seven', action: function () { } }
						],
						collectionLayout: 'fixed columns'
					}
				]
			});

			$('#dt-test-loader-container').width(1000);

			$('button.dt-button').click();
			expect($('div.dt-button-collection').length).toBe(1);
			expect($('div.dt-button-collection').offset().top).toBeGreaterThan($('tbody tr:eq(5)').offset().top);
		});
		it('collectionLayout - responsive three-column - horizontal position', function () {
			// DD-2428 - note currently the buttons go across (normally they're down)
			let firstColumn = $('div.dt-button-collection button:eq(0)').offset();
			let secondColumn = $('div.dt-button-collection button:eq(1)').offset();
			let thirdColumn = $('div.dt-button-collection button:eq(2)').offset();

			expect(firstColumn.left).toBeLessThan(secondColumn.left);
			expect(secondColumn.left).toBeLessThan(thirdColumn.left);
			expect(secondColumn.left - firstColumn.left).toBe(thirdColumn.left - secondColumn.left);
		});
		it('collectionLayout - responsive three-column - vertical position', function () {
			let firstRow = $('div.dt-button-collection button:eq(0)').offset();
			expect($('div.dt-button-collection button:eq(1)').offset().top).toBe(firstRow.top);
			expect($('div.dt-button-collection button:eq(2)').offset().top).toBe(firstRow.top);
			let secondRow = $('div.dt-button-collection button:eq(3)').offset();

			expect(firstRow.top).toBeLessThan(secondRow.top);
		});

		dt.html('basic');
		it('collectionLayout with popoverTitle', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () { } },
							{ text: 'two', action: function () { } },
							{ text: 'three', action: function () { } },
							{ text: 'four', action: function () { } }
						],
						collectionLayout: 'two-column',
						popoverTitle: 'test title'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-collection-title').text()).toBe('test title');
		});

		dt.html('basic');
		it('popoverTitle', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						popoverTitle: 'test title'
					}
				]
			});
			$('button.dt-button').click();
			expect($('div.dt-button-collection-title').text()).toBe('test title');
		});

		dt.html('basic');
		it('dropup - false', function () {
			$('#dt-test-loader-container').prepend('<div style="height: 300px;"></div>');
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						dropup: false
					}
				]
			});
			$('button.dt-button').click();
			expect($('.dt-button-collection').position().top).toBeGreaterThan($('.dt-buttons').position().top);
		});

		dt.html('basic');
		it('dropup - true', function () {
			$('#dt-test-loader-container').prepend('<div style="height: 300px;"></div>');
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						dropup: true
					}
				]
			});
			$('button.dt-button').click();
			expect($('.dt-button-collection').position().top).toBeLessThan($('.dt-buttons').position().top);
		});

		dt.html('basic');
		it('fade', async function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						extend: 'collection',
						buttons: [{ text: 'null', action: function () { } }],
						fade: 500
					}
				]
			});

			$('button.dt-button').click();

			// appears immediately, just takes longer to be displayed
			expect($('button.dt-button').length).toBe(2);

			$('button.dt-button').click();
			expect($('button.dt-button').length).toBe(2);

			await dt.sleep(1000);

			expect($('button.dt-button').length).toBe(1);
		});

		dt.html('basic');
		it('postfixButtons', async function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'one', action: function () { } }],
						postfixButtons: [{ text: 'post', action: function () { } }]
					}
				]
			});

			$('button.dt-button').click();

			expect($('button.dt-button').length).toBe(3);
			expect($('div.dt-button-collection button:eq(0)').text()).toBe('one');
			expect($('div.dt-button-collection button:eq(1)').text()).toBe('post');
		});

		dt.html('basic');
		it('prefixButtons', async function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'one', action: function () { } }],
						prefixButtons: [{ text: 'pre', action: function () { } }]
					}
				]
			});

			$('button.dt-button').click();

			expect($('button.dt-button').length).toBe(3);
			expect($('div.dt-button-collection button:eq(0)').text()).toBe('pre');
			expect($('div.dt-button-collection button:eq(1)').text()).toBe('one');
		});

		dt.html('basic');
		it('prefixButtons and postFixButtons', async function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'one', action: function () { } }],
						postfixButtons: [{ text: 'post', action: function () { } }],
						prefixButtons: [{ text: 'pre', action: function () { } }]
					}
				]
			});

			$('button.dt-button').click();

			expect($('button.dt-button').length).toBe(4);
			expect($('div.dt-button-collection button:eq(0)').text()).toBe('pre');
			expect($('div.dt-button-collection button:eq(1)').text()).toBe('one');
			expect($('div.dt-button-collection button:eq(2)').text()).toBe('post');
		});

		dt.html('basic');
		it('align - button-right', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [{ text: 'test', action: function () { } }],
						span: 'container'
					}
				]
			});
			$('button.dt-button').click();

			let button = $('button.buttons-collection').offset();
			let collection = $('div.dt-button-collection').offset();
			let width = $('div.dt-button-collection').width();

			expect(button.left).toBe(collection.left);
			expect(width).toBeGreaterThan(100);
		});

		dt.html('basic');
		it('Text', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'button1', action: function () { } },
							{ text: 'button2', action: function () { } }
						],
						text: 'Collection Text'
					}
				]
			});
			expect($('button.dt-button span:first').text()).toBe('Collection Text');
		});
	});

	describe('Functional tests - multi-level collections', function () {
		dt.html('basic');
		it('Only one button initially', function () {
			table = $('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						fade: 0, // saves having to sleep in the tests
						extend: 'collection',
						buttons: [
							{ text: 'one', action: function () {} },
							{
								fade: 0, // saves having to sleep in the tests
								popoverTitle: 'Visibility control',
								extend: 'colvis'
							}
						]
					}
				]
			});
			expect($('button.dt-button').length).toBe(1);
		});
		it('Top level buttons shown', function () {
			$('button.dt-button').click();
			expect($('button.dt-button').length).toBe(3);
		});
		it('Second level buttons shown', function () {
			$('button.buttons-colvis').click();
			expect($('button.dt-button').length).toBe(7);
		});
		it('Clicking away hides all collections', async function () {
			await dt.sleep(250);
			$('input.dt-input').trigger('click');
			await dt.sleep(250);
			expect($('button.dt-button').length).toBe(1);
		});
	});
});
