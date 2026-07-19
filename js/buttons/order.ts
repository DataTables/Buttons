import { Api } from 'datatables.net';
import { ButtonFunction } from '../interface';

export const colOrder: ButtonFunction = function (dt, conf) {
	var columns = dt.columns(conf.columns).indexes().toArray();

	return {
		extend: 'collection',
		text: dt.i18n('buttons.order.dropdown', 'Order'),
		className: 'buttons-order',
		autoClose: true,
		buttons: columns.map(idx => ({
			extend: 'columnOrder',
			column: idx
		}))
	};
};

export const columnOrder: ButtonFunction = function (dt, conf) {
	let column = dt.column(conf.column);
	let columnIdx = column.index();
	let orderSequence = dt.settings()[0].columns[columnIdx].orderSequence;
	let split = undefined;

	// Split buttons are only relevant if you can order both ways
	if (orderSequence.includes('asc') && orderSequence.includes('desc')) {
		split = [
			{
				text:
					column.title() +
					' ' +
					dt.i18n('buttons.order.asc', 'ascending'),
				action: () => {
					column.order('asc').draw();
				},
				init: function () {
					dt.on('order', () => {
						this.active(orderActive(dt, columnIdx, 'asc'));
					});
				}
			},
			{
				text:
					column.title() +
					' ' +
					dt.i18n('buttons.order.desc', 'descending'),
				action: () => {
					column.order('desc').draw();
				},
				init: function () {
					dt.on('order', () => {
						this.active(orderActive(dt, columnIdx, 'desc'));
					});
				}
			}
		];
	}

	return {
		text: column.title(),
		className: 'buttons-column-order',
		action: function (e, dt, node, config, cb) {
			// Toggle between the first and second options in the order
			// sequence
			if (
				orderActive(dt, columnIdx, orderSequence[0]) &&
				orderSequence.length > 1
			) {
				column.order(orderSequence[1]).draw();
			}
			else {
				column.order(orderSequence[0]).draw();
			}
		},
		init: function (dt, node, config) {
			dt.on('order', () => {
				this.active(orderActive(dt, columnIdx));
			});
		},
		split: split
	};
};

/**
 * Determine if a column ordering is active
 *
 * @param dt Table in question
 * @param colIdx Column index
 * @param dir Direction. If given, direction is considered, if not any active
 *   ordering on the column is enough.
 * @returns True if the column is being ordered on, false otherwise
 */
function orderActive(dt: Api, colIdx: number, dir?: string) {
	let applied: any[] = dt.order();
	let orderIdx = applied.findIndex(prop => {
		return prop[0] === colIdx;
	});

	if (orderIdx === -1) {
		return false;
	}
	else if (dir) {
		return applied[orderIdx][1] === dir ? true : false;
	}

	return true;
}
