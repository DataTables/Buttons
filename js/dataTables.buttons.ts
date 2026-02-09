import DataTable, {
	Api,
	ApiButtonMethods,
	ApiButtonsMethods,
	ApiSelectorModifier,
	Context,
	HeaderStructure
} from 'datatables.net';
import Buttons, { fadeIn, fadeOut } from './Buttons';
import './interface';
import {
	ButtonAction,
	ButtonConfig,
	ButtonExportOptions,
	ButtonHeaderFormatter,
	ButtonsApiExportDataReturn,
	ButtonsApiExportInfoParameter,
	ButtonSelector,
	ButtonsList,
	ButtonTypes,
	ConfigButtons,
	GroupSelector,
	PopoverOptions,
	ResolvableOption,
	SelectedButtons
} from './interface';

type DeepRequired<T> = Required<{
	[K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

const dom = DataTable.dom;
const util = DataTable.util;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

const buttonSelector = function (
	this: Api,
	group: GroupSelector,
	selector: ButtonSelector
) {
	// Argument shifting
	if (selector === undefined) {
		selector = group;
		group = null;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator(
		true,
		'table',
		function (ctx) {
			if (ctx._buttons) {
				return Buttons.buttonSelector(
					Buttons.instanceSelector(group, ctx._buttons),
					selector
				);
			}
		},
		true
	);

	(res as any)._groupSelector = group;
	return res;
};

// Buttons group and individual button selector
DataTable.Api.register('buttons()', buttonSelector);

// Individual button selector
DataTable.Api.register(
	'button()',
	function (this: Api, group: GroupSelector, selector: ButtonSelector) {
		let res = buttonSelector.call(this, group, selector);

		if (res.length > 1) {
			res.splice(1, res.length);
		}

		(res as any)._groupSelector = group;
		return res;
	}
);

// Active buttons
DataTable.Api.registerPlural(
	'buttons().active()',
	'button().active()',
	function (this: ApiButtonMethods<SelectedButtons>, flag?: boolean) {
		if (flag === undefined) {
			return this.map(function (set) {
				return set.inst.active(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.active(set.node, flag);
		});
	}
);

// Get / set button action
DataTable.Api.registerPlural(
	'buttons().action()',
	'button().action()',
	function (this: ApiButtonMethods<SelectedButtons>, action?: ButtonAction) {
		if (action === undefined) {
			return this.map(function (set) {
				return set.inst.action(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.action(set.node, action);
		});
	}
);

// Collection control
DataTable.Api.registerPlural(
	'buttons().collectionRebuild()',
	'button().collectionRebuild()',
	function (this: ApiButtonMethods<SelectedButtons>, buttons: any) {
		return this.each(function (set) {
			for (var i = 0; i < buttons.length; i++) {
				if (typeof buttons[i] === 'object') {
					buttons[i].parentConf = set;
				}
			}
			set.inst.collectionRebuild(set.node, buttons);
		});
	}
);

// Enable / disable buttons
DataTable.Api.register(
	['buttons().enable()', 'button().enable()'],
	function (this: ApiButtonMethods<SelectedButtons>, flag: boolean) {
		return this.each(function (set) {
			set.inst.enable(set.node, flag);
		});
	}
);

// Disable buttons
DataTable.Api.register(
	['buttons().disable()', 'button().disable()'],
	function (this: ApiButtonMethods<SelectedButtons>) {
		return this.each(function (set) {
			set.inst.disable(set.node);
		});
	}
);

// Button index
DataTable.Api.register(
	'button().index()',
	function (this: ApiButtonMethods<SelectedButtons>) {
		var idx = null;

		this.each(function (set) {
			var res = set.inst.index(set.node.get(0));

			if (res !== null) {
				idx = res;
			}
		});

		return idx;
	}
);

// Get button nodes
DataTable.Api.registerPlural(
	'buttons().nodes()',
	'button().node()',
	function (this: ApiButtonMethods<SelectedButtons>) {
		var d = new DataTable.dom.Dom();

		this.each(function (set) {
			d.add(set.inst.node(set.node).get(0));
		});

		return d;
	}
);

// Get / set button processing state
DataTable.Api.registerPlural(
	'buttons().processing()',
	'button().processing()',
	function (this: ApiButtonMethods<SelectedButtons>, flag?: boolean) {
		if (flag === undefined) {
			return this.map(function (set) {
				return set.inst.processing(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.processing(set.node, flag);
		});
	}
);

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural(
	'buttons().text()',
	'button().text()',
	function (this: ApiButtonMethods<SelectedButtons>, label?: string) {
		if (label === undefined) {
			return this.map(function (set) {
				return set.inst.text(set.node);
			});
		}

		return this.each(function (set) {
			set.inst.text(set.node, label);
		});
	}
);

// Trigger a button's action
DataTable.Api.registerPlural(
	'buttons().trigger()',
	'button().trigger()',
	function (this: ApiButtonMethods<SelectedButtons>) {
		return this.each(function (set) {
			set.inst.node(set.node).trigger('click');
		});
	}
);

// Button resolver to the popover
DataTable.Api.register(
	'button().popover()',
	function (
		this: ApiButtonMethods<SelectedButtons>,
		content: HTMLElement | string | false,
		options: PopoverOptions
	) {
		return this.map(set => {
			return set.inst.popover(
				content,
				this.button(this[0].node),
				options
			);
		});
	}
);

// Get the container elements
DataTable.Api.register(
	'buttons().containers()',
	function (this: ApiButtonMethods<SelectedButtons>) {
		var domInst = new DataTable.dom.Dom();
		var groupSelector = this._groupSelector;

		// We need to use the group selector directly, since if there are no buttons
		// the result set will be empty
		this.iterator(true, 'table', function (ctx) {
			if (ctx._buttons) {
				var insts = Buttons.instanceSelector(
					groupSelector,
					ctx._buttons
				);

				for (var i = 0, ien = insts.length; i < ien; i++) {
					domInst = domInst.add(insts[i].container().get(0));
				}
			}
		});

		return domInst;
	}
);

DataTable.Api.register(
	'buttons().container()',
	function (this: ApiButtonsMethods<SelectedButtons>) {
		// API level of nesting is `buttons()` so we can zip into the containers method
		return this.containers().eq(0);
	}
);

// Add a new button
DataTable.Api.register(
	'button().add()',
	function (
		this: ApiButtonMethods<SelectedButtons>,
		idx: number | string,
		conf: ButtonTypes,
		draw = true
	) {
		var ctx = this.context;
		var node;

		// Don't use `this` as it could be empty - select the instances directly
		if (ctx.length) {
			var inst = Buttons.instanceSelector(
				this._groupSelector,
				ctx[0]._buttons
			);

			if (inst.length) {
				node = inst[0].add(conf, idx, draw);
			}
		}

		return node ? this.button(this._groupSelector, node) : this;
	}
);

// Destroy the button sets selected
DataTable.Api.register(
	'buttons().destroy()',
	function (this: ApiButtonMethods<SelectedButtons>) {
		this.pluck('inst')
			.unique()
			.each(function (inst) {
				inst.destroy();
			});

		return this;
	}
);

// Remove a button
DataTable.Api.registerPlural(
	'buttons().remove()',
	'button().remove()',
	function (this: ApiButtonMethods<SelectedButtons>) {
		this.each(function (set) {
			set.inst.remove(set.node);
		});

		return this;
	}
);

// Information box that can be used by buttons
var _infoTimer: ReturnType<typeof setTimeout> | null;

DataTable.Api.register(
	'buttons.info()',
	function (
		this: Api,
		title: string | false,
		message?: string | HTMLElement,
		time?: number
	) {
		var that = this;
		let info = dom.s('#datatables_buttons_info');

		if (title === false) {
			this.off('destroy.btn-info');

			fadeOut(info, 400, function () {
				this.remove();
			});

			if (_infoTimer) {
				clearTimeout(_infoTimer);
				_infoTimer = null;
			}

			return this;
		}

		if (_infoTimer) {
			clearTimeout(_infoTimer);
		}

		info.remove();

		title = title ? '<h2>' + title + '</h2>' : '';

		fadeIn(
			dom
				.c('div')
				.attr('id', 'datatables_buttons_info')
				.classAdd('dt-button-info')
				.html(title)
				.append(
					dom.c('div')[typeof message === 'string' ? 'html' : 'append'](
						message
					)
				)
				.css('display', 'none')
				.appendTo('body')
		);

		if (time !== undefined && time !== 0) {
			_infoTimer = setTimeout(function () {
				that.buttons.info(false);
			}, time);
		}

		this.on('destroy.btn-info', function () {
			that.buttons.info(false);
		});

		return this;
	}
);

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register(
	'buttons.exportData()',
	function (this: Api, options: ButtonExportOptions) {
		if (this.context.length) {
			return _exportData(new DataTable.Api(this.context[0]), options);
		}
	}
);

// Get information about the export that is common to many of the export data
// types (DRY)
DataTable.Api.register(
	'buttons.exportInfo()',
	function (this: Api, conf: ButtonsApiExportInfoParameter) {
		if (!conf) {
			conf = {};
		}

		return {
			filename: _filename(conf, this),
			title: _title(conf, this),
			messageTop: _message(
				this,
				conf,
				conf.message || conf.messageTop,
				'top'
			),
			messageBottom: _message(this, conf, conf.messageBottom, 'bottom')
		};
	}
);

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
DataTable.Buttons = Buttons;

// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API.
dom.s(document).on('init.dt plugin-init.dt', function (e, settings: Context) {
	if (e.namespace !== 'dt') {
		return;
	}

	var opts = settings.init.buttons || DataTable.defaults.buttons;

	if (opts && !settings._buttons) {
		new Buttons(settings, opts).container();
	}
});

function _init(
	settings: Context,
	options?: Partial<ConfigButtons | ButtonsList>
) {
	var api = new DataTable.Api(settings);
	var opts = options
		? options
		: api.init().buttons || DataTable.defaults.buttons;

	return new Buttons(api, opts).container();
}

// DataTables 1 `dom` feature option
DataTable.ext.feature.push({
	fnInit: _init,
	cFeature: 'B'
});

// DataTables 2 layout feature
if (DataTable.feature) {
	DataTable.feature.register('buttons', _init);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local support function
 */

/**
 * Get the file name for an exported file.
 *
 * @param config Button configuration
 * @param dt DataTable instance
 */
var _filename = function (config: ButtonConfig, dt: Api) {
	// Backwards compatibility
	var filename =
		config.filename === '*' &&
		config.title !== '*' &&
		config.title !== undefined &&
		config.title !== null &&
		config.title !== ''
			? config.title
			: config.filename;

	if (typeof filename === 'function') {
		filename = filename(config, dt);
	}

	if (filename === undefined || filename === null) {
		return null;
	}

	if (filename.indexOf('*') !== -1) {
		filename = filename.replace(/\*/g, dom.s('head > title').text()).trim();
	}

	// Strip characters which the OS will object to
	filename = filename.replace(/[^a-zA-Z0-9_\u00A1-\uFFFF\.,\-_ !\(\)]/g, '');

	var extension = _stringOrFunction(config.extension, config, dt);

	if (!extension) {
		extension = '';
	}

	return filename + extension;
};

/**
 * Simply utility method to allow parameters to be given as a function
 *
 * @param option Option
 * @return Resolved value
 */
var _stringOrFunction = function (
	option: ResolvableOption,
	config: ButtonConfig,
	dt: Api
) {
	if (option === null || option === undefined) {
		return null;
	}
	else if (typeof option === 'function') {
		return option(config, dt);
	}
	return option;
};

/**
 * Get the title for an exported file.
 *
 * @param config Button configuration
 * @param dt DataTable instance
 */
var _title = function (config: ButtonConfig, dt: Api) {
	var title = _stringOrFunction(config.title, config, dt);

	return title === null
		? null
		: title.indexOf('*') !== -1
		? title.replace(/\*/g, dom.s('head > title').text() || 'Exported data')
		: title;
};

var _message = function (
	dt: Api,
	config: ButtonConfig,
	option: ResolvableOption,
	position: string
) {
	var message = _stringOrFunction(option, config, dt);
	if (message === null) {
		return null;
	}

	var caption = dom.s(dt.table().container()).find('caption').eq(0);

	if (message === '*') {
		var side = caption.css('caption-side');

		if (side !== position) {
			return null;
		}

		return caption.count() ? caption.text() : '';
	}

	return message;
};

var _exportData = function (
	dt: Api,
	inOpts: ButtonExportOptions
): ButtonsApiExportDataReturn {
	var config = util.object.assignDeep<DeepRequired<ButtonExportOptions>>(
		{},
		{
			rows: null,
			columns: '',
			modifier: {
				search: 'applied',
				order: 'applied'
			},
			orthogonal: 'display',
			stripHtml: true,
			stripNewlines: true,
			decodeEntities: true,
			escapeExcelFormula: false,
			trim: true,
			format: {
				header: function (d: string) {
					return Buttons.stripData(d, config);
				},
				footer: function (d: string) {
					return Buttons.stripData(d, config);
				},
				body: function (d: string) {
					return Buttons.stripData(d, config);
				}
			},
			customizeData: null,
			customizeZip: null
		},
		inOpts
	);

	var header = dt
		.columns(config.columns)
		.indexes()
		.map(function (idx) {
			var col = dt.column(idx);
			return config.format.header(col.title(), idx, col.header());
		})
		.toArray();

	var footer = dt.table().footer()
		? dt
				.columns(config.columns)
				.indexes()
				.map(function (idx) {
					var el = dt.column(idx).footer();
					var val = '';

					if (el) {
						var inner = dom.s(el).find('.dt-column-title');

						val = inner.count() ? inner.html() : dom.s(el).html();
					}

					return config.format.footer(val, idx, el);
				})
				.toArray()
		: null;

	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = util.object.assign<ApiSelectorModifier>({}, config.modifier);

	if (
		(dt as any).select &&
		typeof (dt as any).select.info === 'function' &&
		modifier.selected === undefined
	) {
		if (
			dt
				.rows(
					config.rows,
					util.object.assign({ selected: true }, modifier)
				)
				.any()
		) {
			util.object.assign(modifier, { selected: true });
		}
	}

	var rowIndexes = dt.rows(config.rows, modifier).indexes().toArray();
	var selectedCells = dt.cells(rowIndexes, config.columns, {
		order: modifier.order
	});
	var cells = selectedCells.render(config.orthogonal).toArray();
	var cellNodes = selectedCells.nodes().toArray();
	var cellIndexes = selectedCells.indexes().toArray();

	var columns = dt.columns(config.columns).count();
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = [];
	var cellCounter = 0;

	for (var i = 0, ien = rows; i < ien; i++) {
		var row = [columns] as any;

		for (var j = 0; j < columns; j++) {
			row[j] = config.format.body(
				cells[cellCounter],
				cellIndexes[cellCounter].row,
				cellIndexes[cellCounter].column,
				cellNodes[cellCounter]
			);

			cellCounter++;
		}

		body[i] = row;
	}

	var data: ButtonsApiExportDataReturn = {
		header: header,
		headerStructure: _headerFormatter(
			config.format.header,
			dt.table().header.structure(config.columns)
		),
		footer: footer,
		footerStructure: _headerFormatter(
			config.format.footer,
			dt.table().footer.structure(config.columns)
		),
		body: body
	};

	if (config.customizeData) {
		config.customizeData(data);
	}

	return data;
};

function _headerFormatter(
	formatter: ButtonHeaderFormatter,
	struct: HeaderStructure[][]
) {
	for (var i = 0; i < struct.length; i++) {
		for (var j = 0; j < struct[i].length; j++) {
			var item = struct[i][j];

			if (item) {
				item.title = formatter(item.title, j, item.cell);
			}
		}
	}

	return struct;
}
