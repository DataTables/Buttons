/*! Buttons for DataTables 3.2.6
 * © SpryMedia Ltd - datatables.net/license
 */
import DataTable, { Api, ApiButtonMethods, Context, Dom } from 'datatables.net';
import {
	ButtonAction,
	ButtonConfig,
	ButtonDom,
	ButtonFunction,
	ButtonSelector,
	ButtonSettings,
	ButtonsKeyboardEvent,
	ButtonsList,
	ButtonTypes,
	ConfigButtons,
	ContextButtons,
	DefaultsButtons,
	DomButtons,
	EntityDecoder,
	FunctionButtonText,
	GroupSelector,
	PopoverOptions,
	SelectedButtons,
	SelectListButtons,
	SettingsButtons,
	SplitStruct,
	StripOptions
} from './interface';

if (!DataTable.versionCheck('3')) {
	throw 'Warning: Buttons requires DataTables 3 or newer';
}

const dom = DataTable.dom;
const util = DataTable.util;
const _exportTextarea = document.createElement('textarea');

// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

// Custom entity decoder for data export
var _entityDecoder: EntityDecoder | null = null;

// Allow for jQuery slim
export function fadeIn(el: Dom, duration: number=400, fn?: (this: Dom) => void) {
	// if ($.fn.animate) {
	// 	el.stop().fadeIn(duration, fn);
	// }
	// else {
	el.css('display', 'block');

	if (fn) {
		fn.call(el);
	}
	// }
}

export function fadeOut(el: Dom, duration: number=400, fn?: (this: Dom) => void) {
	// if ($.fn.animate) {
	// 	el.stop().fadeOut(duration, fn);
	// }
	// else {
	el.css('display', 'none');

	if (fn) {
		fn.call(el);
	}
	// }
}

export default class Buttons {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Statics
	 */

	/**
	 * Show / hide a background layer behind a collection
	 *
	 * @param show Flag to indicate if the background should be shown or
	 *   hidden
	 * @param className Class to assign to the background
	 * @param fade Fade time
	 * @param insertPoint Define the insert point
	 */
	public static background = function (
		show: boolean,
		className: string = '',
		fade: number = 400,
		insertPoint: HTMLElement = document.body
	) {
		if (show) {
			fadeIn(
				dom
					.c('div')
					.classAdd(className)
					.css('display', 'none')
					.insertAfter(insertPoint),
				fade
			);
		}
		else {
			fadeOut(dom.s('div.' + className), fade, function () {
				this.classRemove(className).remove();
			});
		}
	};

	public static buttons: Record<string, ButtonConfig | ButtonFunction> =
		DataTable.ext.buttons;

	/**
	 * Instance selector - select Buttons instances based on an instance
	 * selector value from the buttons assigned to a DataTable. This is only
	 * useful if multiple instances are attached to a DataTable.
	 *
	 * @param group Instance selector - see `instance-selector` documentation on
	 *   the DataTables site
	 * @param Button instance array that was attached to the DataTables settings
	 *   object
	 * @return Buttons instances
	 */
	public static instanceSelector = function (
		group: GroupSelector,
		buttons: ContextButtons[]
	): Buttons[] {
		// If no group selector, then return all
		if (group === undefined || group === null) {
			return buttons.map(v => v.inst);
		}

		var ret: Buttons[] = [];
		var names = buttons.map(v => v.name);

		// Flatten the group selector into an array of single options
		var process = function (input: GroupSelector) {
			if (Array.isArray(input)) {
				for (var i = 0, ien = input.length; i < ien; i++) {
					process(input[i]);
				}
				return;
			}

			if (typeof input === 'string') {
				if (input.indexOf(',') !== -1) {
					// String selector, list of names
					process(input.split(','));
				}
				else {
					// String selector individual name
					var idx = names.indexOf(input.trim());

					if (idx !== -1) {
						ret.push(buttons[idx].inst);
					}
				}
			}
			else if (typeof input === 'number') {
				// Index selector
				ret.push(buttons[input].inst);
			}
			else if (util.is.element(input)) {
				// Element selector
				for (var j = 0; j < buttons.length; j++) {
					if (buttons[j].inst.dom.container.get(0) === input) {
						ret.push(buttons[j].inst);
					}
				}
			}
			else if (typeof input === 'object') {
				// Actual instance selector
				ret.push(input as any as Buttons);
			}
		};

		process(group);

		return ret;
	};

	/**
	 * Button selector - select one or more buttons from a selector input so some
	 * operation can be performed on them.
	 * @param Button instances array that the selector should operate on
	 * @param Button selector - see
	 *   `button-selector` documentation on the DataTables site
	 * @return Array of objects containing `inst` and `idx` properties of
	 *   the selected buttons so you know which instance each button belongs to.
	 */
	public static buttonSelector = function (
		insts: Buttons[],
		selector: ButtonSelector
	) {
		var ret: SelectedButtons[] = [];
		var nodeBuilder = function (
			a: SelectListButtons[],
			buttons: ButtonSettings[],
			baseIdx?: string
		) {
			var button;
			var idx;

			for (var i = 0, ien = buttons.length; i < ien; i++) {
				button = buttons[i];

				if (button) {
					idx = baseIdx !== undefined ? baseIdx + i : i + '';

					a.push({
						node: button.node,
						name: button.conf.name,
						idx: idx
					});

					if (button.buttons) {
						nodeBuilder(a, button.buttons, idx + '-');
					}
				}
			}
		};

		var run = function (selector: ButtonSelector, inst: Buttons) {
			var i, ien;
			var buttons: SelectListButtons[] = [];

			nodeBuilder(buttons, inst.s.buttons);

			var nodes = buttons.map(v => v.node.get(0));

			if (util.is.dom(selector)) {
				selector = selector.get();
			}

			if (selector && util.is.arrayLike(selector)) {
				for (i = 0, ien = (selector as any[]).length; i < ien; i++) {
					run((selector as any)[i], inst);
				}
				return;
			}

			if (
				selector === null ||
				selector === undefined ||
				selector === '*'
			) {
				// Select all
				for (i = 0, ien = buttons.length; i < ien; i++) {
					ret.push({
						inst: inst,
						node: buttons[i].node
					});
				}
			}
			else if (typeof selector === 'number') {
				// Main button index selector
				if (inst.s.buttons[selector]) {
					ret.push({
						inst: inst,
						node: inst.s.buttons[selector].node
					});
				}
			}
			else if (typeof selector === 'string') {
				if (selector.indexOf(',') !== -1) {
					// Split
					var a = selector.split(',');

					for (i = 0, ien = a.length; i < ien; i++) {
						run(a[i].trim(), inst);
					}
				}
				else if (selector.match(/^\d+(\-\d+)*$/)) {
					// Sub-button index selector
					var indexes = buttons.map(v => v.idx);

					ret.push({
						inst: inst,
						node: buttons[indexes.indexOf(selector)].node
					});
				}
				else if (selector.indexOf(':name') !== -1) {
					// Button name selector
					var name = selector.replace(':name', '');

					for (i = 0, ien = buttons.length; i < ien; i++) {
						if (buttons[i].name === name) {
							ret.push({
								inst: inst,
								node: buttons[i].node
							});
						}
					}
				}
				else {
					// CSS selector on the nodes
					dom.s(nodes)
						.filter(selector)
						.each(function (el) {
							ret.push({
								inst: inst,
								node: dom.s(el)
							});
						});
				}
			}
			else if (util.is.element(selector)) {
				// Node selector
				var idx = nodes.indexOf(selector);

				if (idx !== -1) {
					ret.push({
						inst: inst,
						node: dom.s(nodes[idx])
					});
				}
			}
		};

		for (var i = 0, ien = insts.length; i < ien; i++) {
			var inst = insts[i];

			run(selector, inst);
		}

		return ret;
	};

	/**
	 * Default function used for formatting output data.
	 *
	 * @param str Data to strip
	 */
	public static stripData = function (
		input: string | HTMLElement,
		config?: StripOptions
	) {
		// If the input is an HTML element, we can use the HTML from it (HTML
		// might be stripped below).
		var str =
			input !== null &&
			typeof input === 'object' &&
			input.nodeName &&
			input.nodeType
				? input.innerHTML
				: (input as string);

		if (typeof str !== 'string') {
			return str;
		}

		// Always remove script tags
		str = Buttons.stripHtmlScript(str);

		// Always remove comments
		str = Buttons.stripHtmlComments(str);

		if (!config || config.stripHtml) {
			str = DataTable.util.stripHtml(str);
		}

		if (!config || config.trim) {
			str = str.trim();
		}

		if (!config || config.stripNewlines) {
			str = str.replace(/\n/g, ' ');
		}

		if (!config || config.decodeEntities) {
			if (_entityDecoder) {
				str = _entityDecoder(str);
			}
			else {
				_exportTextarea.innerHTML = str;
				str = _exportTextarea.value;
			}
		}

		// Prevent Excel from running a formula
		if (!config || config.escapeExcelFormula) {
			if (str.match(/^[=@\t\r]/)) {
				str = "'" + str;
			}
		}

		return str;
	};

	/**
	 * Provide a custom entity decoding function - e.g. a regex one, which can
	 * be much faster than the built in DOM option, but also larger code size.
	 *
	 * @param fn
	 */
	public static entityDecoder = function (fn: EntityDecoder) {
		_entityDecoder = fn;
	};

	/**
	 * Display (and replace if there is an existing one) a popover attached to a
	 * button
	 *
	 * @param contentIn Content to show
	 * @param hostButton DT API instance of the button
	 * @param inOpts Options (see object below for all options)
	 */
	public popover(
		contentIn: HTMLElement | string | false,
		hostButton: ApiButtonMethods<any>,
		inOpts: PopoverOptions
	) {
		var dt = hostButton;
		var c = this.c;
		var closed = false;
		var options = util.object.assign<PopoverOptions>(
			{
				align: 'button-left', // button-right, dt-container, split-left, split-right
				autoClose: false,
				background: true,
				backgroundClassName: 'dt-button-background',
				closeButton: true,
				containerClassName: c.dom.collection.container.className,
				contentClassName: c.dom.collection.container.content.className,
				collectionLayout: '',
				collectionTitle: '',
				dropup: false,
				fade: 400,
				popoverTitle: '',
				rightAlignClassName: 'dt-button-right',
				tag: c.dom.collection.container.tag
			},
			inOpts
		);

		var containerSelector =
			options.tag + '.' + options.containerClassName.replace(/ /g, '.');
		var hostButtonNode = hostButton.node();
		var hostNode = options.collectionLayout.includes('fixed')
			? dom.s('body')
			: hostButton.node();

		var close = function () {
			closed = true;

			fadeOut(dom.s(containerSelector), options.fade, function () {
				this.detach();
			});

			dt.buttons('[aria-haspopup="dialog"][aria-expanded="true"]')
				.nodes()
				.attr('aria-expanded', 'false');

			dom.s('div.dt-button-background').off('click.dtb-collection');
			Buttons.background(
				false,
				options.backgroundClassName,
				options.fade,
				hostNode.get(0)
			);

			dom.w.off('resize.resize.dtb-collection');
			dom.s('body').off('.dtb-collection');
			dt.off('buttons-action.b-internal');
			dt.off('destroy.dtb-popover');

			dom.s('body').trigger('buttons-popover-hide.dt');
		};

		if (contentIn === false) {
			close();
			return;
		}

		var existingExpanded = dt
			.buttons('[aria-haspopup="dialog"][aria-expanded="true"]')
			.nodes();

		if (existingExpanded.count()) {
			// Reuse the current position if the button that was triggered is
			// inside an existing collection
			if (hostNode.closest(containerSelector).count()) {
				hostNode = existingExpanded.eq(0);
			}

			close();
		}

		let content: Dom =
			typeof contentIn === 'string'
				? dom.c('div').html(contentIn).children()
				: dom.s(contentIn);

		// Sort buttons if defined
		if (options.sort) {
			var elements = content.find('button').mapTo(function (el) {
				return {
					text: dom.s(el).text(),
					el: el
				};
			});

			elements.sort(function (a, b) {
				return a.text.localeCompare(b.text);
			});

			content.append(
				elements.map(function (v) {
					return v.el;
				})
			);
		}

		// Try to be smart about the layout
		var cnt = content.find('.dt-button').count();
		var mod = '';

		if (cnt === 3) {
			mod = 'dtb-b3';
		}
		else if (cnt === 2) {
			mod = 'dtb-b2';
		}
		else if (cnt === 1) {
			mod = 'dtb-b1';
		}

		var display = dom
			.c(options.tag)
			.classAdd(options.containerClassName)
			.classAdd(options.collectionLayout)
			.classAdd(options.splitAlignClass)
			.classAdd(mod)
			.css('display', 'none')
			.attr({
				'aria-modal': true,
				role: 'dialog'
			});

		content
			.classAdd(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostButtonNode.attr('aria-expanded', 'true');

		if (!hostNode.isAttached()) {
			let possibilities = dom
				.s(document.body)
				.children('div, section, p');

			hostNode = possibilities.eq(possibilities.count() - 1);
		}

		if (options.popoverTitle) {
			display.prepend(
				'<div class="dt-button-collection-title">' +
					options.popoverTitle +
					'</div>'
			);
		}
		else if (options.collectionTitle) {
			display.prepend(
				'<div class="dt-button-collection-title">' +
					options.collectionTitle +
					'</div>'
			);
		}

		if (options.closeButton) {
			display
				.prepend('<div class="dtb-popover-close">&times;</div>')
				.classAdd('dtb-collection-closeable');
		}

		fadeIn(display.insertAfter(hostNode), options.fade);

		var tableContainer = dom.s(hostButton.table().container());
		var position = display.css('position');

		if (options.span === 'container' || options.align === 'dt-container') {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width() + 'px');
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (position === 'absolute') {
			// Align relative to the host button
			var offsetParent = dom.s(hostNode.get(0).offsetParent);
			var buttonPosition = hostNode.position();
			var buttonOffset = hostNode.offset();
			var containerPosition = offsetParent.position();

			// Set the initial position so we can read height / width
			var top = buttonPosition.top + hostNode.height('outer');
			var left = buttonPosition.left;

			display.css({
				top: top + 'px',
				left: left + 'px'
			});

			// Get the popover position
			var computed = window.getComputedStyle(display.get(0));
			var displayOffset = display.offset();
			var displayWidth = display.width('outer');
			var displayHeight = display.height('outer');
			var popoverSizes = {
				height: displayHeight,
				width: displayWidth,
				right: displayOffset.left + displayWidth,
				bottom: displayOffset.top + displayHeight,
				marginTop: parseFloat(computed.marginTop),
				marginBottom: parseFloat(computed.marginBottom),
				top: displayOffset.top,
				left: displayOffset.left
			};

			// First position per the class requirements - pop up and right align
			if (options.dropup) {
				top =
					buttonPosition.top -
					popoverSizes.height -
					popoverSizes.marginTop -
					popoverSizes.marginBottom;
			}

			if (
				options.align === 'button-right' ||
				display.classHas(options.rightAlignClassName)
			) {
				left =
					buttonPosition.left -
					popoverSizes.width +
					hostNode.width('outer');
			}

			// Container alignment - make sure it doesn't overflow the table container
			if (
				options.align === 'dt-container' ||
				options.align === 'container'
			) {
				if (left < buttonPosition.left) {
					left = -buttonPosition.left;
				}
			}

			// Window adjustment
			if (
				containerPosition.left + left + popoverSizes.width >
				dom.w.width()
			) {
				// Overflowing the document to the right
				left =
					dom.w.width() - popoverSizes.width - containerPosition.left;
			}

			if (buttonOffset.left + left < 0) {
				// Off to the left of the document
				left = -buttonOffset.left;
			}

			if (
				containerPosition.top + top + popoverSizes.height >
				dom.w.height() + dom.w.scrollTop()
			) {
				// Pop up if otherwise we'd need the user to scroll down
				top =
					buttonPosition.top -
					popoverSizes.height -
					popoverSizes.marginTop -
					popoverSizes.marginBottom;
			}

			if (offsetParent.offset().top + top < dom.w.scrollTop()) {
				// Correction for when the top is beyond the top of the page
				top = buttonPosition.top + hostNode.height('outer');
			}

			// Calculations all done - now set it
			display.css({
				top: top + 'px',
				left: left + 'px'
			});
		}
		else {
			// Fix position - centre on screen
			var place = function () {
				var half = dom.w.height() / 2;

				var top = display.height() / 2;
				if (top > half) {
					top = half;
				}

				display.css('marginTop', top + 'px');
			};

			place();

			dom.w.on('resize.dtb-collection', function () {
				place();
			});
		}

		if (options.background) {
			Buttons.background(
				true,
				options.backgroundClassName,
				options.fade,
				options.backgroundHost || hostNode.get(0)
			);
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		dom.s('div.dt-button-background').on(
			'click.dtb-collection',
			function () {}
		);

		if (options.autoClose) {
			setTimeout(function () {
				dt.on('buttons-action.b-internal', function (e, btn, dt, node) {
					if (node.get(0) === hostNode.get(0)) {
						return;
					}

					close();
				});
			}, 0);
		}

		display.trigger('buttons-popover.dt');

		dt.on('destroy.dtb-popover', close);

		setTimeout(function () {
			closed = false;

			dom.s('body')
				.on('click.dtb-collection', function (e) {
					if (closed) {
						return;
					}

					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					// var back = $.fn.addBack ? 'addBack' : 'andSelf';
					// var parent = dom.s(e.target).parent().eq(0);

					if (
						// TODO Not actually sure what this is for?
						// (
						// 	!$(e.target).parents()[back]().filter(content).length &&
						// 	parent.classHas('dt-buttons')
						// ) ||
						dom.s(e.target).classHas('dt-button-background')
					) {
						close();
					}
				})
				.on('keyup.dtb-collection', function (e) {
					if (e.keyCode === 27) {
						close();
					}
				})
				.on('keydown.dtb-collection', function (e) {
					// Focus trap for tab key
					var elements = content.find('a, button');
					var active = document.activeElement as HTMLElement;
					var first = elements.eq(0);
					var last = elements.eq(elements.count() - 1);

					if (e.keyCode !== 9) {
						// tab
						return;
					}

					if (elements.get().includes(active)) {
						// If current focus is not inside the popover
						first.focus();
						e.preventDefault();
					}
					else if (e.shiftKey) {
						// Reverse tabbing order when shift key is pressed
						if (active === elements.get(0)) {
							last.focus();
							e.preventDefault();
						}
					}
					else {
						if (active === last.get(0)) {
							first.focus();
							e.preventDefault();
						}
					}
				});
		}, 0);
	}

	/**
	 * Common function for stripping HTML comments
	 *
	 * @param input
	 * @returns
	 */
	public static stripHtmlComments = function (input: string) {
		var previous;

		do {
			previous = input;
			input = input.replace(
				/(<!--.*?--!?>)|(<!--[\S\s]+?--!?>)|(<!--[\S\s]*?$)/g,
				''
			);
		} while (input !== previous);

		return input;
	};

	/**
	 * Common function for stripping HTML script tags
	 *
	 * @param string input
	 * @returns
	 */
	public static stripHtmlScript = function (input: string) {
		var previous;

		do {
			previous = input;
			input = input.replace(
				/<script\b[^<]*(?:(?!<\/script[^>]*>)<[^<]*)*<\/script[^>]*>/gi,
				''
			);
		} while (input !== previous);

		return input;
	};

	/**
	 * Buttons defaults. For full documentation, please refer to the docs/option
	 * directory or the DataTables site.
	 */
	public static defaults: DefaultsButtons = {
		buttons: ['copy', 'excel', 'csv', 'pdf', 'print'],
		name: 'main',
		tabIndex: 0,
		dom: {
			button: {
				tag: 'button',
				className: 'dt-button',
				active: 'dt-button-active', // class name
				disabled: 'disabled', // class name
				dropClass: '',
				dropHtml: '<span class="dt-button-down-arrow">&#x25BC;</span>',
				liner: {
					tag: 'span',
					className: ''
				},
				spacer: {
					className: 'dt-button-spacer',
					tag: 'span'
				}
			},
			container: {
				tag: 'div',
				className: 'dt-buttons'
			},
			collection: {
				container: {
					// The element used for the dropdown
					className: 'dt-button-collection',
					content: {
						className: '',
						tag: 'div'
					},
					tag: 'div'
				}
				// optionally
				// , button: IButton - buttons inside the collection container
				// , split: ISplit - splits inside the collection container
			},
			split: {
				action: {
					// action button
					className: 'dt-button-split-drop-button dt-button',
					tag: 'button'
				},
				dropdown: {
					// button to trigger the dropdown
					align: 'split-right',
					className: 'dt-button-split-drop',
					splitAlignClass: 'dt-button-split-left',
					tag: 'button'
				},
				wrapper: {
					// wrap around both
					className: 'dt-button-split',
					tag: 'div'
				}
			}
		}
	};

	/**
	 * Version information
	 */
	public static version = '3.2.6';

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get / set the action of a button
	 * @param node Button element
	 * @param action Function to set
	 * @return Self for chaining
	 */
	public action(node: HTMLElement | Dom, action?: ButtonAction) {
		var button = this._nodeToButton(node);

		if (action === undefined) {
			return button ? button.conf.action : null;
		}

		if (button) {
			button.conf.action = action;
		}

		return this;
	}

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 *
	 * @param node Button element
	 * @param flag Enable / disable flag
	 * @return Self for chaining or boolean for getter
	 */
	public active(node: HTMLElement | Dom, flag?: boolean) {
		var button = this._nodeToButton(node);
		var klass = this.c.dom.button.active;

		if (
			button &&
			button.inCollection &&
			this.c.dom.collection.button &&
			this.c.dom.collection.button.active !== undefined
		) {
			klass = this.c.dom.collection.button.active;
		}

		if (flag === undefined) {
			return button ? button.node.classHas(klass) : false;
		}

		if (button) {
			button.node.classToggle(klass, flag === undefined ? true : flag);
		}

		return this;
	}

	/**
	 * Add a new button
	 *
	 * @param config Button configuration object, base string name or function
	 * @param idx Button index for where to insert the button
	 * @param draw Trigger a draw. Set a false when adding lots of buttons,
	 *   until the last button.
	 * @return Self for chaining
	 */
	public add(config: ButtonTypes, idx?: string | number, draw = true) {
		var buttons = this.s.buttons;

		if (typeof idx === 'string') {
			var parts = idx.split('-');
			var base = this.s as any;

			for (var i = 0, ien = parts.length - 1; i < ien; i++) {
				base = base.buttons[parseInt(parts[i])];
			}

			buttons = base.buttons;
			idx = parseInt(parts[parts.length - 1]);
		}

		let split = config ? (config as any).split : undefined;
		let node = this._expandButton(
			buttons,
			config,
			split,
			(!config || !split || split.length === 0) && base,
			false,
			idx
		);

		if (draw === undefined || draw === true) {
			this._draw();
		}

		return node;
	}

	/**
	 * Clear buttons from a collection and then insert new buttons
	 */
	public collectionRebuild(node: HTMLElement | Dom, newButtons: ButtonsList) {
		var button = this._nodeToButton(node);

		if (!button) {
			return;
		}

		if (newButtons !== undefined) {
			var i;
			// Need to reverse the array
			for (i = button.buttons.length - 1; i >= 0; i--) {
				this.remove(button.buttons[i].node);
			}

			// If the collection has prefix and / or postfix buttons we need to add them in
			if (button.conf.prefixButtons) {
				newButtons.unshift.apply(newButtons, button.conf.prefixButtons);
			}

			if (button.conf.postfixButtons) {
				newButtons.push.apply(newButtons, button.conf.postfixButtons);
			}

			for (i = 0; i < newButtons.length; i++) {
				var newBtn = newButtons[i] as any;

				this._expandButton(
					button.buttons,
					newBtn,
					newBtn !== undefined &&
						newBtn.config !== undefined &&
						newBtn.config.split !== undefined,
					true,
					newBtn.parentConf !== undefined &&
						newBtn.parentConf.split !== undefined,
					undefined,
					newBtn.parentConf
				);
			}
		}

		this._draw(button.collection, button.buttons);
	}

	/**
	 * Get the container node for the buttons
	 *
	 * @return Buttons node
	 */
	public container() {
		return this.dom.container;
	}

	/**
	 * Disable a button
	 * @param node Button node
	 * @return Self for chaining
	 */
	public disable(node: HTMLElement | Dom) {
		var button = this._nodeToButton(node);

		if (button) {
			if (button.isSplit) {
				button.node
					.children()
					.eq(0)
					.classAdd(this.c.dom.button.disabled)
					.prop('disabled', true);
			}
			else {
				button.node
					.classAdd(this.c.dom.button.disabled)
					.prop('disabled', true);
			}

			button.disabled = true;

			this._checkSplitEnable();
		}

		return this;
	}

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	public destroy() {
		// Key event listener
		dom.s('body').off('keyup.' + this.s.namespace);

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;

		for (i = 0, ien = buttons.length; i < ien; i++) {
			this.remove(buttons[i].node.get(0));
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0]._buttons;

		for (i = 0, ien = buttonInsts.length; i < ien; i++) {
			if (buttonInsts[i].inst === this) {
				buttonInsts.splice(i, 1);
				break;
			}
		}

		return this;
	}

	/**
	 * Enable / disable a button
	 *
	 * @param node Button node
	 * @param flag Enable / disable flag
	 * @return Self for chaining
	 */
	public enable(node: HTMLElement | Dom, flag = true) {
		if (flag === false) {
			return this.disable(node);
		}

		var button = this._nodeToButton(node);

		if (button) {
			if (button.isSplit) {
				button.node
					.children()
					.eq(0)
					.classRemove(this.c.dom.button.disabled)
					.prop('disabled', false);
			}
			else {
				button.node
					.classRemove(this.c.dom.button.disabled)
					.prop('disabled', false);
			}

			button.disabled = false;

			this._checkSplitEnable();
		}
		return this;
	}

	/**
	 * Get a button's index
	 *
	 * This is internally recursive
	 *
	 * @param node Button to get the index of
	 * @return Button index
	 */
	public index(
		node: HTMLElement,
		nested?: string,
		buttons?: ButtonSettings[]
	): string | null {
		if (!nested) {
			nested = '';
		}

		if (!buttons) {
			buttons = this.s.buttons;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			var inner = buttons[i].buttons;

			if (buttons[i].node.get(0) === node) {
				return nested + i;
			}

			if (inner && inner.length) {
				var match = this.index(node, i + '-', inner);

				if (match !== null) {
					return match;
				}
			}
		}

		return null;
	}

	/**
	 * Get the instance name for the button set selector
	 *
	 * @return Instance name
	 */
	public name() {
		return this.c.name;
	}

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param node Button node
	 * @return Button element, or container
	 */
	public node(node?: HTMLElement | Dom) {
		if (!node) {
			return this.dom.container;
		}

		var button = this._nodeToButton(node);
		return button ? button.node: null;
	}

	/**
	 * Set / get a processing class on the selected button
	 *
	 * @param node Triggering button node
	 * @param flag true to add, false to remove, undefined to get
	 * @return Getter value or this if a setter.
	 */
	public processing(node: HTMLElement | Dom, flag?: boolean) {
		var dt = this.s.dt;
		var button = this._nodeToButton(node);

		if (flag === undefined) {
			return button ? button.node.classHas('processing') : false;
		}

		if (button) {
			button.node.classToggle('processing', flag);

			dom.s(dt.table().node()).trigger('buttons-processing.dt', false, [
				flag,
				dt.button(node),
				dt,
				button.node,
				button.conf
			]);
		}

		return this;
	}

	/**
	 * Remove a button.
	 *
	 * @param node Button node
	 * @return Self for chaining
	 */
	public remove(node: HTMLElement | Dom) {
		let button = this._nodeToButton(node);

		if (!button) {
			return this;
		}

		let host = this._nodeToHost(node);
		let dt = this.s.dt;

		// Remove any child buttons first
		if (button.buttons.length) {
			for (let i = button.buttons.length - 1; i >= 0; i--) {
				this.remove(button.buttons[i].node.get(0));
			}
		}

		button.conf.destroying = true;

		// Allow the button to remove event handlers, etc
		if (button.conf.destroy) {
			button.conf.destroy.call(
				dt.button(node),
				dt,
				button.node,
				button.conf
			);
		}

		this._removeKey(button.conf);

		button.node.remove();

		if (button.inserter) {
			button.inserter.remove();
		}

		if (host) {
			let idx = host.indexOf(button);
			host.splice(idx, 1);
		}

		return this;
	}

	/**
	 * Get the text for a button
	 *
	 * @param node Button index
	 * @return Button text
	 */
	public text(node: HTMLElement | Dom): string;
	/**
	 * Set the text for a button
	 *
	 * @param node Button index
	 * @param label Text to set
	 * @return Buttons instance
	 */
	public text(node: HTMLElement | Dom, label: string | FunctionButtonText): Buttons;
	public text(node: HTMLElement | Dom, label?: string | FunctionButtonText): any {
		let button = this._nodeToButton(node);

		if (!button) {
			return label === undefined ? '' : this;
		}

		let textNode = button.textNode;
		let dt = this.s.dt;
		let text = function (opt: string | FunctionButtonText) {
			return typeof opt === 'function'
				? opt(dt, button.node, button.conf)
				: opt;
		};

		if (label === undefined) {
			return text(button.conf.text || '');
		}

		button.conf.text = label;

		if (textNode) {
			textNode.html(text(label));
		}

		return this;
	}

	private c: DefaultsButtons;
	private dom: DomButtons;
	private s: SettingsButtons;

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	constructor(
		dtIn: Context | Api,
		configIn?: true | ConfigButtons | ButtonsList
	) {
		let config: ConfigButtons;
		let dt = new DataTable.Api(dtIn);

		// If there is no config set it to an empty object
		if (typeof configIn === 'undefined') {
			config = {};
		}
		else if (configIn === true) {
			// Allow a boolean true for defaults
			config = {};
		}
		else if (Array.isArray(configIn)) {
			// For easy configuration of buttons an array can be given
			config = { buttons: configIn };
		}
		else {
			config = configIn;
		}

		this.c = util.object.assignDeep({}, Buttons.defaults, config);

		// Don't want a deep copy for the buttons
		if (config.buttons) {
			this.c.buttons = config.buttons;
		}

		this.s = {
			dt,
			buttons: [],
			listenKeys: '',
			namespace: 'dtb' + _instCounter++
		};

		this.dom = {
			container: dom
				.c(this.c.dom.container.tag)
				.classAdd(this.c.dom.container.className)
		};

		var that = this;
		var dtSettings = this.s.dt.settings()[0];
		var buttons = this.c.buttons;

		if (!dtSettings._buttons) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push({
			inst: this,
			name: this.c.name
		});

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			this.add(buttons[i]);
		}

		dt.on('destroy', function (e, settings) {
			if (settings === dtSettings) {
				that.destroy();
			}
		});

		// Global key event binding to listen for button keys
		dom.c('body').on('keyup.' + this.s.namespace, function (e) {
			if (
				!document.activeElement ||
				document.activeElement === document.body
			) {
				// Use a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if (that.s.listenKeys.toLowerCase().indexOf(character) !== -1) {
					that._keypress(character, e);
				}
			}
		});
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param conf Resolved button configuration object
	 */
	private _addKey(conf: ButtonConfig) {
		if (conf.key) {
			this.s.listenKeys += util.is.plainObject(conf.key)
				? conf.key.key
				: conf.key;
		}
	}

	/**
	 * Insert the buttons into the container. Call without parameters!
	 *
	 * @param container Recursive only - Insert point
	 * @param buttons Recursive only - Buttons array
	 */
	private _draw(container?: Dom | null, buttons?: ButtonSettings[]) {
		if (!container) {
			container = this.dom.container;
		}

		if (!buttons) {
			buttons = this.s.buttons;
		}

		container.children().detach();

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			container.append(buttons[i].inserter);
			container.append(document.createTextNode(' '));

			if (buttons[i].buttons && buttons[i].buttons.length) {
				this._draw(buttons[i].collection, buttons[i].buttons);
			}
		}
	}

	/**
	 * Create buttons from an array of buttons
	 */
	private _expandButton(
		attachTo: ButtonSettings[],
		button: ButtonsList | ButtonTypes | undefined,
		split: ButtonsList | ButtonTypes | undefined,
		inCollection: boolean,
		inSplit: boolean,
		attachPoint?: number,
		parentConf?: ButtonConfig
	) {
		var dt = this.s.dt;
		var isSplit = false;
		var domCollection = this.c.dom.collection;
		var buttons = !Array.isArray(button) ? [button] : button;
		var lastButton;

		if (button === undefined) {
			buttons = !Array.isArray(split) ? [split] : split;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			// If the configuration is an array, then expand the buttons at this
			// point
			if (Array.isArray(buttons[i])) {
				this._expandButton(
					attachTo,
					buttons[i],
					undefined,
					inCollection,
					parentConf !== undefined && parentConf.split !== undefined,
					attachPoint,
					parentConf
				);

				continue;
			}

			var conf = this._resolveExtends(buttons[i]);

			if (!conf) {
				continue;
			}

			isSplit = conf.split ? true : false; // TODO wut? conf.config && conf.config.split ? true : false;

			var built = this._buildButton(
				conf,
				inCollection,
				conf.split !== undefined,
				// TODO don't understand this
				//  ||
				// 	(conf.config !== undefined &&
				// 		conf.config.split !== undefined),
				inSplit
			);

			if (!built) {
				continue;
			}

			if (attachPoint !== undefined && attachPoint !== null) {
				attachTo.splice(attachPoint, 0, built);
				attachPoint++;
			}
			else {
				attachTo.push(built);
			}

			// Any button type can have a drop icon set
			if (built.conf.dropIcon && !built.conf.split) {
				built.node
					.classAdd(this.c.dom.button.dropClass)
					.append(this.c.dom.button.dropHtml);
			}

			// Create the dropdown for a collection
			if (built.conf.buttons) {
				built.collection = dom.c(domCollection.container.content.tag);
				built.conf._collection = built.collection;

				this._expandButton(
					built.buttons,
					built.conf.buttons,
					built.conf.split,
					!isSplit,
					isSplit,
					attachPoint,
					built.conf
				);
			}

			// And the split collection
			if (built.conf.split) {
				built.collection = dom.c(domCollection.container.tag);
				built.conf._collection = built.collection;

				for (var j = 0; j < built.conf.split.length; j++) {
					var item: any = built.conf.split[j];

					if (typeof item === 'object') {
						item.parent = parentConf;

						if (item.collectionLayout === undefined) {
							item.collectionLayout = (
								built.conf as any
							).collectionLayout;
						}

						if (item.dropup === undefined) {
							item.dropup = (built.conf as any).dropup;
						}

						if (item.fade === undefined) {
							item.fade = (built.conf as any).fade;
						}
					}
				}

				this._expandButton(
					built.buttons,
					built.conf.buttons,
					built.conf.split,
					!isSplit,
					isSplit,
					attachPoint,
					built.conf
				);
			}

			built.conf.parent = parentConf;

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if (conf.init) {
				conf.init.call(dt.button(built.node), dt, built.node, conf);
			}

			lastButton = built.node;
		}

		return lastButton;
	}

	/**
	 * Create an individual button
	 *
	 * @param config Resolved button configuration
	 * @param inCollection `true` if a collection button
	 * @param isSplit Is a split button
	 * @param inSplit Is a part of a split button
	 * @return {object} Completed button description object
	 */
	private _buildButton(
		config: ButtonConfig,
		inCollection: boolean,
		isSplit: boolean,
		inSplit: boolean
	): ButtonSettings | false {
		var that = this;
		var configDom = this.c.dom;
		var textNode: Dom | null = null;
		var dt = this.s.dt;
		var setLinerTab = false;
		var text = function (opt: string | FunctionButtonText) {
			return typeof opt === 'function' ? opt(dt, button, config) : opt;
		};

		// Create an object that describes the button which can be in
		// `dom.button`, or `dom.collection.button` or `dom.split.button` or
		// `dom.collection.split.button`! Each should extend from `dom.button`.
		var domStructure: ButtonDom = util.object.assignDeep(
			{},
			configDom.button
		);

		if (inCollection && isSplit && configDom.collection.split) {
			util.object.assignDeep(
				domStructure,
				configDom.collection.split.action
			);
		}
		else if (inSplit || inCollection) {
			util.object.assignDeep(domStructure, configDom.collection.button);
		}
		else if (isSplit) {
			util.object.assignDeep(domStructure, configDom.split.button);
		}

		// Spacers don't do much other than insert an element into the DOM
		if (config.spacer) {
			var spacer = dom
				.c(domStructure.spacer.tag)
				.classAdd([
					'dt-button-spacer',
					config.style || '',
					domStructure.spacer.className
				])
				.html(text(config.text || ''));

			return {
				buttons: [],
				collection: null,
				conf: config,
				disabled: false,
				inserter: spacer,
				inSplit: inSplit,
				inCollection: inCollection,
				isCollection: false,
				isSplit: false,
				node: spacer,
				nodeChild: null,
				textNode: spacer
			};
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, PDF button require pdfmake
		if (config.available && !config.available(dt, config) && !config.html) {
			return false;
		}

		var button: Dom;

		if (!config.html) {
			var run: ButtonAction = function (e, dt, button, config, done) {
				config.action?.call(
					dt.button(button),
					e,
					dt,
					button,
					config,
					done
				);

				dom.s(dt.table().node()).trigger('buttons-action.dt', false, [
					dt.button(button),
					dt,
					button,
					config
				]);
			};

			var action: ButtonAction = function (e, dt, button, config) {
				if (config.async) {
					that.processing(button.get(0), true);

					setTimeout(function () {
						run(e, dt, button, config, function () {
							that.processing(button.get(0), false);
						});
					}, config.async);
				}
				else {
					run(e, dt, button, config, () => {});
				}
			};

			var tag = config.tag || domStructure.tag;
			var clickBlurs =
				config.clickBlurs === undefined ? true : config.clickBlurs;

			button = dom
				.c(tag)
				.classAdd(domStructure.className)
				.attr('aria-controls', this.s.dt.table().node().id)
				.on('click.dtb', function (e) {
					e.preventDefault();

					if (
						!button.classHas(domStructure.disabled) &&
						config.action
					) {
						action(e, dt, button, config, () => {});
					}

					if (clickBlurs) {
						button.blur();
					}
				})
				.on('keypress.dtb', function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();

						if (
							!button.classHas(domStructure.disabled) &&
							config.action
						) {
							action(e, dt, button, config, () => {});
						}
					}
				});

			// Make `a` tags act like a link
			if (tag.toLowerCase() === 'a') {
				button.attr('href', '#');
			}

			// Button tags should have `type=button` so they don't have any default behaviour
			if (tag.toLowerCase() === 'button') {
				button.attr('type', 'button');
			}

			if (domStructure.liner.tag) {
				var lc = domStructure.liner.tag.toLowerCase();
				var liner = dom
					.c(lc)
					.html(text(config.text || ''))
					.classAdd(domStructure.liner.className);

				if (lc === 'a') {
					liner.attr('href', '#');
				}

				if (lc === 'a' || lc === 'button') {
					liner.attr('tabindex', this.s.dt.settings()[0].tabIndex);
					setLinerTab = true;
				}

				button.append(liner);
				textNode = liner;
			}
			else {
				button.html(text(config.text || ''));
				textNode = button;
			}

			if (!setLinerTab) {
				button.attr('tabindex', this.s.dt.settings()[0].tabIndex);
			}

			if (config.enabled === false) {
				button.classAdd(domStructure.disabled);
			}

			if (config.className) {
				button.classAdd(config.className);
			}

			if (config.titleAttr) {
				button.attr('title', text(config.titleAttr));
			}

			if (config.attr) {
				button.attr(config.attr);
			}

			if (!config.namespace) {
				config.namespace = '.dt-button-' + _buttonCounter++;
			}

			// TODO This was for Bulma. Confirm that split still works for Bulma
			// with out it.
			// TODO!
			// if (config.config !== undefined && config.config.split) {
			// 	config.split = config.config.split;
			// }
		}
		else {
			button = dom.c('div').html(config.html);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if (buttonContainer && buttonContainer.tag) {
			inserter = dom
				.c(buttonContainer.tag)
				.classAdd(buttonContainer.className)
				.append(button);
		}
		else {
			inserter = button;
		}

		this._addKey(config);

		// Style integration callback for DOM manipulation
		if (this.c.buttonCreated) {
			inserter = this.c.buttonCreated(config, inserter);
		}

		var splitDiv: Dom;

		if (isSplit) {
			var dropdownConf: SplitStruct = inCollection
				? util.object.assignDeep(
						this.c.dom.split,
						this.c.dom.collection.split
				  )
				: this.c.dom.split;
			var wrapperConf = dropdownConf.wrapper;

			splitDiv = dom
				.c(wrapperConf.tag)
				.classAdd(wrapperConf.className)
				.append(button);

			var dropButtonConfig: ButtonConfig = util.object.assign(config, {
				autoClose: true,
				align: dropdownConf.dropdown.align,
				attr: {
					'aria-haspopup': 'dialog',
					'aria-expanded': false
				},
				className: dropdownConf.dropdown.className,
				closeButton: false,
				splitAlignClass: dropdownConf.dropdown.splitAlignClass,
				text: dropdownConf.dropdown.text
			});

			this._addKey(dropButtonConfig);

			var splitAction: ButtonAction = function (e, dt, button, config) {
				if (
					typeof Buttons.buttons.split === 'object' &&
					Buttons.buttons.split.action
				) {
					Buttons.buttons.split.action.call(
						dt.button(splitDiv),
						e,
						dt,
						button,
						config,
						() => {}
					);
				}

				dom.s(dt.table().node()).trigger('buttons-action.dt', false, [
					dt.button(button),
					dt,
					button,
					config
				]);
				button.attr('aria-expanded', true);
			};

			var dropButton = dom
				.c('button')
				.classAdd([
					dropdownConf.dropdown.className,
					'dt-button',
					this.c.dom.button.dropClass
				])
				.html(this.c.dom.button.dropHtml)
				.on('click.dtb', function (e) {
					e.preventDefault();
					e.stopPropagation();

					if (!dropButton.classHas(domStructure.disabled)) {
						splitAction(
							e,
							dt,
							dropButton,
							dropButtonConfig,
							() => {}
						);
					}
					if (clickBlurs) {
						dropButton.blur();
					}
				})
				.on('keypress.dtb', function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();

						if (!dropButton.classHas(domStructure.disabled)) {
							splitAction(
								e,
								dt,
								dropButton,
								dropButtonConfig,
								() => {}
							);
						}
					}
				});

			if (config.split && config.split.length === 0) {
				dropButton.classAdd('dtb-hide-drop');
			}

			if (dropButtonConfig.attr) {
				splitDiv.append(dropButton).attr(dropButtonConfig.attr);
			}

			button = splitDiv;
		}

		return {
			buttons: [],
			collection: null,
			conf: config,
			disabled: false,
			inserter: isSplit ? button : inserter,
			inCollection: inCollection,
			inSplit: inSplit,
			isCollection: false,
			isSplit: isSplit,
			node: button,
			nodeChild:
				button && button.children && button.children().count()
					? button.children().get(0)
					: null,
			textNode: textNode
		};
	}

	/**
	 * Spin over buttons checking if splits should be enabled or not.
	 * @param buttons Array of buttons to check
	 */
	private _checkSplitEnable(buttons?: ButtonSettings[]) {
		if (!buttons) {
			buttons = this.s.buttons;
		}

		for (var i = 0; i < buttons.length; i++) {
			var button = buttons[i];

			// Check if the button is a split one and if so, determine
			// its state
			if (button.isSplit) {
				var splitBtn = button.node.get(0).childNodes[1];

				if (this._checkAnyEnabled(button.buttons)) {
					// Enable the split
					dom.s(splitBtn)
						.classRemove(this.c.dom.button.disabled)
						.prop('disabled', false);
				}
				else {
					dom.s(splitBtn)
						.classAdd(this.c.dom.button.disabled)
						.prop('disabled', false);
				}
			}
			else if (button.isCollection) {
				// Nest down into collections
				this._checkSplitEnable(button.buttons);
			}
		}
	}

	/**
	 * Check an array of buttons and see if any are enabled in it
	 *
	 * @param buttons Button array
	 * @returns true if a button is enabled, false otherwise
	 */
	private _checkAnyEnabled(buttons: ButtonSettings[]) {
		for (var i = 0; i < buttons.length; i++) {
			if (!buttons[i].disabled) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Get the button object from a node (recursive)
	 *
	 * @param node Button node
	 * @param buttons Button array, uses base if not defined
	 * @return Button object
	 */
	private _nodeToButton(
		node: HTMLElement | Dom,
		buttons?: ButtonSettings[]
	): ButtonSettings | void {
		if (!buttons) {
			buttons = this.s.buttons;
		}

		if (util.is.dom(node)) {
			node = node.get(0);
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			if (
				buttons[i].node.get(0) === node ||
				buttons[i].nodeChild === node
			) {
				return buttons[i];
			}

			if (buttons[i].buttons.length) {
				var ret = this._nodeToButton(node, buttons[i].buttons);

				if (ret) {
					return ret;
				}
			}
		}
	}

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param node Button node
	 * @param buttons Button array, uses base if not defined
	 * @return Button's host array
	 */
	private _nodeToHost(
		node: HTMLElement | Dom,
		buttons?: ButtonSettings[]
	): ButtonSettings[] | void {
		if (!buttons) {
			buttons = this.s.buttons;
		}

		if (util.is.dom(node)) {
			node = node.get(0);
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			if (buttons[i].node.get(0) === node) {
				return buttons;
			}

			if (buttons[i].buttons.length) {
				var ret = this._nodeToHost(node, buttons[i].buttons);

				if (ret) {
					return ret;
				}
			}
		}
	}

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 *
	 * @param character The character pressed
	 * @param e Key event that triggered this call
	 */
	private _keypress(character: string, e: ButtonsKeyboardEvent) {
		// Check if this button press already activated on another instance of Buttons
		if (e._buttonsHandled) {
			return;
		}

		var run = function (conf: ButtonConfig, node: Dom) {
			if (!conf.key) {
				return;
			}

			if (conf.key === character) {
				e._buttonsHandled = true;
				node.trigger('click');
			}
			else if (util.is.plainObject(conf.key)) {
				if (conf.key.key !== character) {
					return;
				}

				if (conf.key.shiftKey && !e.shiftKey) {
					return;
				}

				if (conf.key.altKey && !e.altKey) {
					return;
				}

				if (conf.key.ctrlKey && !e.ctrlKey) {
					return;
				}

				if (conf.key.metaKey && !e.metaKey) {
					return;
				}

				// Made it this far - it is good
				e._buttonsHandled = true;
				node.trigger('click');
			}
		};

		var recurse = function (a: ButtonSettings[]) {
			for (var i = 0, ien = a.length; i < ien; i++) {
				run(a[i].conf, a[i].node);

				if (a[i].buttons.length) {
					recurse(a[i].buttons);
				}
			}
		};

		recurse(this.s.buttons);
	}

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 *
	 * @param conf Button configuration
	 */
	private _removeKey(conf: ButtonConfig) {
		if (conf.key) {
			var character = util.is.plainObject(conf.key)
				? conf.key.key
				: conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = a.indexOf(character!);

			a.splice(idx, 1);
			this.s.listenKeys = a.join('');
		}
	}

	/**
	 * Resolve a button configuration
	 *
	 * @param confIn Button config to resolve
	 * @return Button configuration
	 */
	private _resolveExtends(confIn: ButtonTypes): ButtonConfig | false {
		var that = this;
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function (
			base: string | Function | object
		): ButtonConfig | false {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while (!util.is.plainObject(base)) {
				if (base === undefined) {
					return false;
				}

				if (typeof base === 'function') {
					base = base.call(that, dt, conf);

					if (!base) {
						return false;
					}
				}
				else if (typeof base === 'string') {
					if (!Buttons.buttons[base]) {
						return { html: base };
					}

					base = Buttons.buttons[base];
				}

				loop++;
				if (loop > 30) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return util.object.assign({}, base);
		};

		var confRes = toConfObject(confIn);

		if (confRes === false) {
			return false;
		}

		var conf = confRes;

		while (conf && conf.extend) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if (!Buttons.buttons[conf.extend]) {
				throw 'Cannot extend unknown button type: ' + conf.extend;
			}

			var objArray = toConfObject(Buttons.buttons[conf.extend]);

			if (!objArray) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			// TODO Was added for Bulma. I don't understand why it is here.
			// What's it doing here?
			// TODO!
			// if (conf.config !== undefined && objArray.config !== undefined) {
			// 	conf.config = util.object.assign(
			// 		{},
			// 		objArray.config,
			// 		conf.config
			// 	);
			// }

			conf = util.object.assign({}, objArray, conf) as ButtonConfig;

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if (originalClassName && conf.className !== originalClassName) {
				conf.className = originalClassName + ' ' + conf.className;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		// Buttons to be added to a collection  -gives the ability to define
		// if buttons should be added to the start or end of a collection
		var postfixButtons = conf.postfixButtons;
		if (postfixButtons) {
			if (!conf.buttons) {
				conf.buttons = [];
			}

			for (i = 0, ien = postfixButtons.length; i < ien; i++) {
				conf.buttons.push(postfixButtons[i]);
			}
		}

		var prefixButtons = conf.prefixButtons;
		if (prefixButtons) {
			if (!conf.buttons) {
				conf.buttons = [];
			}

			for (i = 0, ien = prefixButtons.length; i < ien; i++) {
				conf.buttons.splice(i, 0, prefixButtons[i]);
			}
		}

		return conf;
	}
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Core Button types
 */
Buttons.buttons.collection = {
	text: function (dt) {
		return dt.i18n('buttons.collection', 'Collection');
	},
	className: 'buttons-collection',
	closeButton: false,
	dropIcon: true,
	init: function (dt, button) {
		button.attr('aria-expanded', false);
	},
	action: function (e, dt, button, config) {
		if (config._collection!.isAttached()) {
			this.popover(false, config);
		}
		else {
			this.popover(config._collection, config);
		}

		// When activated using a key - auto focus on the
		// first item in the popover
		if (e.type === 'keypress') {
			config._collection!.find('a, button').eq(0).focus();
		}
	},
	attr: {
		'aria-haspopup': 'dialog'
	}
	// Also the popover options, defined in Buttons.popover
};

Buttons.buttons.split = {
	text: function (dt) {
		return dt.i18n('buttons.split', 'Split');
	},
	className: 'buttons-split',
	closeButton: false,
	init: function (dt, button) {
		return button.attr('aria-expanded', false);
	},
	action: function (e, dt, button, config) {
		this.popover(config._collection, config);
	},
	attr: {
		'aria-haspopup': 'dialog'
	}
	// Also the popover options, defined in Buttons.popover
};

Buttons.buttons.copy = function (dt, conf) {
	if (Buttons.buttons.copyHtml5) {
		return 'copyHtml5';
	}
};

Buttons.buttons.csv = function (dt, conf) {
	if (
		typeof Buttons.buttons.csvHtml5 === 'object' &&
		Buttons.buttons.csvHtml5.available!(dt, conf)
	) {
		return 'csvHtml5';
	}
};

Buttons.buttons.excel = function (dt, conf) {
	if (
		typeof Buttons.buttons.excelHtml5 === 'object' &&
		Buttons.buttons.excelHtml5.available!(dt, conf)
	) {
		return 'excelHtml5';
	}
};

Buttons.buttons.pdf = function (dt, conf) {
	if (
		typeof Buttons.buttons.pdfHtml5 === 'object' &&
		Buttons.buttons.pdfHtml5.available!(dt, conf)
	) {
		return 'pdfHtml5';
	}
};

Buttons.buttons.pageLength = function (dt) {
	var lengthMenu = dt.settings()[0].lengthMenu;
	var vals = [];
	var lang: string[] = [];
	var text = function (dt: Api) {
		return dt.i18n(
			'buttons.pageLength',
			{
				'-1': 'Show all rows',
				_: 'Show %d rows'
			},
			dt.page.len()
		);
	};

	// Support for DataTables 1.x 2D array
	if (Array.isArray(lengthMenu[0])) {
		vals = lengthMenu[0];
		lang = lengthMenu[1];
	}
	else {
		for (var i = 0; i < lengthMenu.length; i++) {
			var option = lengthMenu[i];

			// Support for DataTables 2 object in the array
			if (util.is.plainObject(option)) {
				vals.push(option.value);
				lang.push(option.label);
			}
			else {
				vals.push(option);
				lang.push(option);
			}
		}
	}

	return {
		extend: 'collection',
		text: text,
		className: 'buttons-page-length',
		autoClose: true,
		buttons: vals.map(function (val, i) {
			return {
				text: lang[i],
				className: 'button-page-length',
				action: function (e, dt) {
					dt.page.len(val).draw();
				},
				init: function (dt, node, conf) {
					var that = this;
					var fn = function () {
						that.active(dt.page.len() === val);
					};

					dt.on('length.dt' + conf.namespace, fn);
					fn();
				},
				destroy: function (dt, node, conf) {
					dt.off('length.dt' + conf.namespace);
				}
			};
		}),
		init: function (dt, node, conf) {
			var that = this;
			dt.on('length.dt' + conf.namespace, function () {
				that.text(conf.text);
			});
		},
		destroy: function (dt, node, conf) {
			dt.off('length.dt' + conf.namespace);
		}
	};
};

Buttons.buttons.spacer = {
	style: 'empty',
	spacer: true,
	text: function (dt) {
		return dt.i18n('buttons.spacer', '');
	}
};
