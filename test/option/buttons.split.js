describe('Buttons - options - buttons.split', function () {
	let params = undefined;
	let count = 0;

	dt.libs({
		js: ['jquery', 'datatables', 'buttons'],
		css: ['datatables', 'buttons']
	});

	describe('Functional tests', function () {
		dt.html('basic');
		it('Simple split', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						fade: 0, // saves having to sleep in the tests
						action: function () {},
						split: [
							{
								text: 'second',
								action: function () {}
							},
							{
								text: 'third',
								action: function () {}
							}
						]
					}
				]
			});

			expect($('button.dt-button').length).toBe(2);
			expect($('button.dt-button:eq(0)').text()).toBe('first');
			expect($('button.dt-button:eq(1)').text()).toBe('▼');
		});
		it('... verify split buttons', function () {
			$('button.dt-button:eq(1)').click();

			expect($('button.dt-button').length).toBe(4);
			expect($('button.dt-button:eq(0)').text()).toBe('first');
			expect($('button.dt-button:eq(1)').text()).toBe('▼');
			expect($('button.dt-button:eq(2)').text()).toBe('second');
			expect($('button.dt-button:eq(3)').text()).toBe('third');
		});

		dt.html('basic');
		it('Multi-layer split', function () {
			$('#example').DataTable({
				dom: 'Bfrtip',
				buttons: [
					{
						text: 'first',
						fade: 0, // saves having to sleep in the tests
						action: function () {},
						split: [
							{
								text: 'second',
								action: function () {},
								split: [
									{
										text: 'fourth',
										action: function () {}
									},
									{
										text: 'fifth',
										action: function () {}
									},
									{
										text: 'sixth',
										action: function () {}
									}
								]
							},
							{
								text: 'third',
								action: function () {
									console.log('second');
								}
							}
						]
					}
				]
			});
			expect($('button.dt-button').length).toBe(2);
			expect($('button.dt-button:eq(0)').text()).toBe('first');
			expect($('button.dt-button:eq(1)').text()).toBe('▼');
		});
		it('... open first level', function () {
			$('button.dt-button:eq(1)').click();

			expect($('button.dt-button').length).toBe(5);
			expect($('button.dt-button:eq(0)').text()).toBe('first');
			expect($('button.dt-button:eq(1)').text()).toBe('▼');
			expect($('button.dt-button:eq(2)').text()).toBe('second');
			expect($('button.dt-button:eq(3)').text()).toBe('▼');
			expect($('button.dt-button:eq(4)').text()).toBe('third');
		});
		it('... open second level', function () {
			$('button.dt-button:eq(3)').click();

			expect($('button.dt-button').length).toBe(5);
			expect($('button.dt-button:eq(0)').text()).toBe('first');
			expect($('button.dt-button:eq(1)').text()).toBe('▼');
			expect($('button.dt-button:eq(2)').text()).toBe('fourth');
			expect($('button.dt-button:eq(3)').text()).toBe('fifth');
			expect($('button.dt-button:eq(4)').text()).toBe('sixth');
		});

		// dt.html('basic');
		// it('No action function', function () {
		// 	$('#example').DataTable({
		// 		dom: 'Bfrtip',
		// 		buttons: [
		// 			{
		// 				text: 'top',
		// 				split: [{text: 'one'}, {text: 'two'}]
		// 			}
		// 		]
		// 	});

		// 	expect($('button.dt-button').length).toBe(2);
		// 	expect($('button.dt-button:eq(0)').text()).toBe('top');
		// 	expect($('button.dt-button:eq(1)').text()).toBe('▼');
		// });
		// it('... open first level', function () {
		// 	$('button.dt-button:eq(1)').click();

		// 	expect($('button.dt-button').length).toBe(4);
		// 	expect($('button.dt-button:eq(0)').text()).toBe('top');
		// 	expect($('button.dt-button:eq(1)').text()).toBe('▼');
		// 	expect($('button.dt-button:eq(2)').text()).toBe('one');
		// 	expect($('button.dt-button:eq(3)').text()).toBe('two');
		// });
	});
});
