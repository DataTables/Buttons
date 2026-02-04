/*! Buttons for DataTables 3.2.6
 * © SpryMedia Ltd - datatables.net/license
 */
import DataTable, { Api, Context, Dom } from 'datatables.net';
import {
	ButtonAction,
	ButtonConfig,
	ButtonDom,
	ButtonSettings,
	ButtonsKeyboardEvent,
	ButtonsList,
	ButtonTypes,
	ConfigButtons,
	DefaultsButtons,
	DomButtons,
	FunctionButtonText,
	SettingsButtons,
	SplitStruct
} from './interface';

if (!DataTable.versionCheck('3')) {
	throw 'Warning: Buttons requires DataTables 3 or newer';
}

const dom = DataTable.dom;
const util = DataTable.util;

// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

// Custom entity decoder for data export
var _entityDecoder = null;

// Allow for jQuery slim
function _fadeIn(el, duration, fn) {
	if ($.fn.animate) {
		el.stop().fadeIn(duration, fn);
	}
	else {
		el.css('display', 'block');

		if (fn) {
			fn.call(el);
		}
	}
}

function _fadeOut(el, duration, fn) {
	if ($.fn.animate) {
		el.stop().fadeOut(duration, fn);
	}
	else {
		el.css('display', 'none');

		if (fn) {
			fn.call(el);
		}
	}
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
			_fadeIn(
				$('<div/>')
					.classAdd(className)
					.css('display', 'none')
					.insertAfter(insertPoint),
				fade
			);
		}
		else {
			_fadeOut($('div.' + className), fade, function () {
				$(this).classRemove(className).remove();
			});
		}
	};

	/**
	 * Instance selector - select Buttons instances based on an instance selector
	 * value from the buttons assigned to a DataTable. This is only useful if
	 * multiple instances are attached to a DataTable.
	 * @param  {string|int|array} Instance selector - see `instance-selector`
	 *   documentation on the DataTables site
	 * @param  {array} Button instance array that was attached to the DataTables
	 *   settings object
	 * @return {array} Buttons instances
	 */
	public static instanceSelector = function (group, buttons) {
		if (group === undefined || group === null) {
			return $.map(buttons, function (v) {
				return v.inst;
			});
		}

		var ret = [];
		var names = $.map(buttons, function (v) {
			return v.name;
		});

		// Flatten the group selector into an array of single options
		var process = function (input) {
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
					var idx = $.inArray(input.trim(), names);

					if (idx !== -1) {
						ret.push(buttons[idx].inst);
					}
				}
			}
			else if (typeof input === 'number') {
				// Index selector
				ret.push(buttons[input].inst);
			}
			else if (typeof input === 'object' && input.nodeName) {
				// Element selector
				for (var j = 0; j < buttons.length; j++) {
					if (buttons[j].inst.dom.container[0] === input) {
						ret.push(buttons[j].inst);
					}
				}
			}
			else if (typeof input === 'object') {
				// Actual instance selector
				ret.push(input);
			}
		};

		process(group);

		return ret;
	};

	/**
	 * Button selector - select one or more buttons from a selector input so some
	 * operation can be performed on them.
	 * @param  {array} Button instances array that the selector should operate on
	 * @param  {string|int|node|jQuery|array} Button selector - see
	 *   `button-selector` documentation on the DataTables site
	 * @return {array} Array of objects containing `inst` and `idx` properties of
	 *   the selected buttons so you know which instance each button belongs to.
	 */
	public static buttonSelector = function (insts, selector) {
		var ret = [];
		var nodeBuilder = function (a, buttons, baseIdx) {
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

		var run = function (selector, inst) {
			var i, ien;
			var buttons = [];
			nodeBuilder(buttons, inst.s.buttons);

			var nodes = $.map(buttons, function (v) {
				return v.node;
			});

			if (Array.isArray(selector) || selector instanceof $) {
				for (i = 0, ien = selector.length; i < ien; i++) {
					run(selector[i], inst);
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
					var indexes = $.map(buttons, function (v) {
						return v.idx;
					});

					ret.push({
						inst: inst,
						node: buttons[$.inArray(selector, indexes)].node
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
					// jQuery selector on the nodes
					$(nodes)
						.filter(selector)
						.each(function () {
							ret.push({
								inst: inst,
								node: this
							});
						});
				}
			}
			else if (typeof selector === 'object' && selector.nodeName) {
				// Node selector
				var idx = $.inArray(selector, nodes);

				if (idx !== -1) {
					ret.push({
						inst: inst,
						node: nodes[idx]
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
	public static stripData = function (str: string, config) {
		// If the input is an HTML element, we can use the HTML from it (HTML
		// might be stripped below).
		if (
			str !== null &&
			typeof str === 'object' &&
			str.nodeName &&
			str.nodeType
		) {
			str = str.innerHTML;
		}

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
	 * @param fn
	 */
	public static entityDecoder = function (fn) {
		_entityDecoder = fn;
	};

	/**
	 * Display (and replace if there is an existing one) a popover attached to a button
	 * @param {string|node} content Content to show
	 * @param {DataTable.Api} hostButton DT API instance of the button
	 * @param {object} inOpts Options (see object below for all options)
	 */
	public popover(content, hostButton, inOpts) {
		var dt = hostButton;
		var c = this.c;
		var closed = false;
		var options = $.extend(
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
			? $('body')
			: hostButton.node();

		var close = function () {
			closed = true;

			_fadeOut($(containerSelector), options.fade, function () {
				$(this).detach();
			});

			$(
				dt
					.buttons('[aria-haspopup="dialog"][aria-expanded="true"]')
					.nodes()
			).attr('aria-expanded', 'false');

			$('div.dt-button-background').off('click.dtb-collection');
			Buttons.background(
				false,
				options.backgroundClassName,
				options.fade,
				hostNode
			);

			$(window).off('resize.resize.dtb-collection');
			$('body').off('.dtb-collection');
			dt.off('buttons-action.b-internal');
			dt.off('destroy.dtb-popover');

			$('body').trigger('buttons-popover-hide.dt');
		};

		if (content === false) {
			close();
			return;
		}

		var existingExpanded = $(
			dt.buttons('[aria-haspopup="dialog"][aria-expanded="true"]').nodes()
		);
		if (existingExpanded.length) {
			// Reuse the current position if the button that was triggered is inside an existing collection
			if (hostNode.closest(containerSelector).length) {
				hostNode = existingExpanded.eq(0);
			}

			close();
		}

		// Sort buttons if defined
		if (options.sort) {
			var elements = $('button', content)
				.map(function (idx, el) {
					return {
						text: $(el).text(),
						el: el
					};
				})
				.toArray();

			elements.sort(function (a, b) {
				return a.text.localeCompare(b.text);
			});

			$(content).append(
				elements.map(function (v) {
					return v.el;
				})
			);
		}

		// Try to be smart about the layout
		var cnt = $('.dt-button', content).length;
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

		var display = $('<' + options.tag + '/>')
			.classAdd(options.containerClassName)
			.classAdd(options.collectionLayout)
			.classAdd(options.splitAlignClass)
			.classAdd(mod)
			.css('display', 'none')
			.attr({
				'aria-modal': true,
				role: 'dialog'
			});

		content = $(content)
			.classAdd(options.contentClassName)
			.attr('role', 'menu')
			.appendTo(display);

		hostButtonNode.attr('aria-expanded', 'true');

		if (hostNode.parents('body')[0] !== document.body) {
			hostNode = $(document.body).children('div, section, p').last();
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

		_fadeIn(display.insertAfter(hostNode), options.fade);

		var tableContainer = $(hostButton.table().container());
		var position = display.css('position');

		if (options.span === 'container' || options.align === 'dt-container') {
			hostNode = hostNode.parent();
			display.css('width', tableContainer.width());
		}

		// Align the popover relative to the DataTables container
		// Useful for wide popovers such as SearchPanes
		if (position === 'absolute') {
			// Align relative to the host button
			var offsetParent = $(hostNode[0].offsetParent);
			var buttonPosition = hostNode.position();
			var buttonOffset = hostNode.offset();
			var tableSizes = offsetParent.offset();
			var containerPosition = offsetParent.position();
			var computed = window.getComputedStyle(offsetParent[0]);

			tableSizes.height = offsetParent.outerHeight();
			tableSizes.width =
				offsetParent.width() + parseFloat(computed.paddingLeft);
			tableSizes.right = tableSizes.left + tableSizes.width;
			tableSizes.bottom = tableSizes.top + tableSizes.height;

			// Set the initial position so we can read height / width
			var top = buttonPosition.top + hostNode.outerHeight();
			var left = buttonPosition.left;

			display.css({
				top: top,
				left: left
			});

			// Get the popover position
			computed = window.getComputedStyle(display[0]);
			var popoverSizes = display.offset();

			popoverSizes.height = display.outerHeight();
			popoverSizes.width = display.outerWidth();
			popoverSizes.right = popoverSizes.left + popoverSizes.width;
			popoverSizes.bottom = popoverSizes.top + popoverSizes.height;
			popoverSizes.marginTop = parseFloat(computed.marginTop);
			popoverSizes.marginBottom = parseFloat(computed.marginBottom);

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
					hostNode.outerWidth();
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
				$(window).width()
			) {
				// Overflowing the document to the right
				left =
					$(window).width() -
					popoverSizes.width -
					containerPosition.left;
			}

			if (buttonOffset.left + left < 0) {
				// Off to the left of the document
				left = -buttonOffset.left;
			}

			if (
				containerPosition.top + top + popoverSizes.height >
				$(window).height() + $(window).scrollTop()
			) {
				// Pop up if otherwise we'd need the user to scroll down
				top =
					buttonPosition.top -
					popoverSizes.height -
					popoverSizes.marginTop -
					popoverSizes.marginBottom;
			}

			if (offsetParent.offset().top + top < $(window).scrollTop()) {
				// Correction for when the top is beyond the top of the page
				top = buttonPosition.top + hostNode.outerHeight();
			}

			// Calculations all done - now set it
			display.css({
				top: top,
				left: left
			});
		}
		else {
			// Fix position - centre on screen
			var place = function () {
				var half = $(window).height() / 2;

				var top = display.height() / 2;
				if (top > half) {
					top = half;
				}

				display.css('marginTop', top * -1);
			};

			place();

			$(window).on('resize.dtb-collection', function () {
				place();
			});
		}

		if (options.background) {
			Buttons.background(
				true,
				options.backgroundClassName,
				options.fade,
				options.backgroundHost || hostNode
			);
		}

		// This is bonkers, but if we don't have a click listener on the
		// background element, iOS Safari will ignore the body click
		// listener below. An empty function here is all that is
		// required to make it work...
		$('div.dt-button-background').on(
			'click.dtb-collection',
			function () {}
		);

		if (options.autoClose) {
			setTimeout(function () {
				dt.on('buttons-action.b-internal', function (e, btn, dt, node) {
					if (node[0] === hostNode[0]) {
						return;
					}
					close();
				});
			}, 0);
		}

		$(display).trigger('buttons-popover.dt');

		dt.on('destroy.dtb-popover', close);

		setTimeout(function () {
			closed = false;
			$('body')
				.on('click.dtb-collection', function (e) {
					if (closed) {
						return;
					}

					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';
					var parent = $(e.target).parent()[0];

					if (
						(!$(e.target).parents()[back]().filter(content)
							.length &&
							!$(parent).classHas('dt-buttons')) ||
						$(e.target).classHas('dt-button-background')
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
					var elements = $('a, button', content);
					var active = document.activeElement;

					if (e.keyCode !== 9) {
						// tab
						return;
					}

					if (elements.index(active) === -1) {
						// If current focus is not inside the popover
						elements.first().focus();
						e.preventDefault();
					}
					else if (e.shiftKey) {
						// Reverse tabbing order when shift key is pressed
						if (active === elements[0]) {
							elements.last().focus();
							e.preventDefault();
						}
					}
					else {
						if (active === elements.last()[0]) {
							elements.first().focus();
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
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 */ /**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	public action(node, action) {
		var button = this._nodeToButton(node);

		if (action === undefined) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	}

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	public active(node, flag) {
		var button = this._nodeToButton(node);
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if (
			button.inCollection &&
			this.c.dom.collection.button &&
			this.c.dom.collection.button.active !== undefined
		) {
			klass = this.c.dom.collection.button.active;
		}

		if (flag === undefined) {
			return jqNode.classHas(klass);
		}

		jqNode.toggleClass(klass, flag === undefined ? true : flag);

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
	public collectionRebuild(node, newButtons) {
		var button = this._nodeToButton(node);

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
				var newBtn = newButtons[i];

				this._expandButton(
					button.buttons,
					newBtn,
					newBtn !== undefined &&
						newBtn.config !== undefined &&
						newBtn.config.split !== undefined,
					true,
					newBtn.parentConf !== undefined &&
						newBtn.parentConf.split !== undefined,
					null,
					newBtn.parentConf
				);
			}
		}

		this._draw(button.collection, button.buttons);
	}

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	public container() {
		return this.dom.container;
	}

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	public disable(node) {
		var button = this._nodeToButton(node);

		if (button.isSplit) {
			$(button.node.childNodes[0])
				.classAdd(this.c.dom.button.disabled)
				.prop('disabled', true);
		}
		else {
			$(button.node)
				.classAdd(this.c.dom.button.disabled)
				.prop('disabled', true);
		}

		button.disabled = true;

		this._checkSplitEnable();

		return this;
	}

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	public destroy() {
		// Key event listener
		$('body').off('keyup.' + this.s.namespace);

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;

		for (i = 0, ien = buttons.length; i < ien; i++) {
			this.remove(buttons[i].node);
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for (i = 0, ien = buttonInsts.length; i < ien; i++) {
			if (buttonInsts.inst === this) {
				buttonInsts.splice(i, 1);
				break;
			}
		}

		return this;
	}

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	public enable(node, flag) {
		if (flag === false) {
			return this.disable(node);
		}

		var button = this._nodeToButton(node);

		if (button.isSplit) {
			$(button.node.childNodes[0])
				.classRemove(this.c.dom.button.disabled)
				.prop('disabled', false);
		}
		else {
			$(button.node)
				.classRemove(this.c.dom.button.disabled)
				.prop('disabled', false);
		}

		button.disabled = false;

		this._checkSplitEnable();

		return this;
	}

	/**
	 * Get a button's index
	 *
	 * This is internally recursive
	 * @param {element} node Button to get the index of
	 * @return {string} Button index
	 */
	public index(node, nested, buttons) {
		if (!nested) {
			nested = '';
			buttons = this.s.buttons;
		}

		for (var i = 0, ien = buttons.length; i < ien; i++) {
			var inner = buttons[i].buttons;

			if (buttons[i].node === node) {
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
	 * @return {string} Instance name
	 */
	public name() {
		return this.c.name;
	}

	/**
	 * Get a button's node of the buttons container if no button is given
	 * @param  {node} [node] Button node
	 * @return {jQuery} Button element, or container
	 */
	public node(node) {
		if (!node) {
			return this.dom.container;
		}

		var button = this._nodeToButton(node);
		return $(button.node);
	}

	/**
	 * Set / get a processing class on the selected button
	 * @param {element} node Triggering button node
	 * @param  {boolean} flag true to add, false to remove, undefined to get
	 * @return {boolean|Buttons} Getter value or this if a setter.
	 */
	public processing(node, flag) {
		var dt = this.s.dt;
		var button = this._nodeToButton(node);

		if (flag === undefined) {
			return $(button.node).classHas('processing');
		}

		$(button.node).toggleClass('processing', flag);

		$(dt.table().node()).triggerHandler('buttons-processing.dt', [
			flag,
			dt.button(node),
			dt,
			$(node),
			button.conf
		]);

		return this;
	}

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	public remove(node: HTMLElement) {
		let button = this._nodeToButton(node);

		if (!button) {
			return this;
		}

		let host = this._nodeToHost(node);
		let dt = this.s.dt;

		// Remove any child buttons first
		if (button.buttons.length) {
			for (let i = button.buttons.length - 1; i >= 0; i--) {
				this.remove(button.buttons[i].node);
			}
		}

		button.conf.destroying = true;

		// Allow the button to remove event handlers, etc
		if (button.conf.destroy) {
			button.conf.destroy.call(dt.button(node), dt, $(node), button.conf);
		}

		this._removeKey(button.conf);

		$(button.node).remove();

		if (button.inserter) {
			$(button.inserter).remove();
		}

		let idx = host.indexOf(button);
		host.splice(idx, 1);

		return this;
	}

	/**
	 * Get the text for a button
	 *
	 * @param node Button index
	 * @return Button text
	 */
	public text(node: HTMLElement): string;
	/**
	 * Set the text for a button
	 *
	 * @param node Button index
	 * @param label Text to set
	 * @return Buttons instance
	 */
	public text(node: HTMLElement, label: string | FunctionButtonText): Buttons;
	public text(node: HTMLElement, label?: string | FunctionButtonText): any {
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
							item.collectionLayout = (built.conf as any).collectionLayout;
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
						button.trigger('blur');
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
				_dtButtons.split.action.call(
					dt.button(splitDiv),
					e,
					dt,
					button,
					config
				);

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
						dropButton.trigger('blur');
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
	private _checkSplitEnable(buttons: ButtonSettings[]) {
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
		node: HTMLElement,
		buttons?: ButtonSettings[]
	): ButtonSettings | void {
		if (!buttons) {
			buttons = this.s.buttons;
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
		node: HTMLElement,
		buttons?: ButtonSettings[]
	): ButtonSettings[] | void {
		if (!buttons) {
			buttons = this.s.buttons;
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
					if (!_dtButtons[base]) {
						return { html: base };
					}

					base = _dtButtons[base];
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
			if (!_dtButtons[conf.extend]) {
				throw 'Cannot extend unknown button type: ' + conf.extend;
			}

			var objArray = toConfObject(_dtButtons[conf.extend]);

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

$.extend(_dtButtons, {
	collection: {
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
			if (config._collection.parents('body').length) {
				this.popover(false, config);
			}
			else {
				this.popover(config._collection, config);
			}

			// When activated using a key - auto focus on the
			// first item in the popover
			if (e.type === 'keypress') {
				$('a, button', config._collection).eq(0).focus();
			}
		},
		attr: {
			'aria-haspopup': 'dialog'
		}
		// Also the popover options, defined in Buttons.popover
	},
	split: {
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
	},
	copy: function () {
		if (_dtButtons.copyHtml5) {
			return 'copyHtml5';
		}
	},
	csv: function (dt, conf) {
		if (_dtButtons.csvHtml5 && _dtButtons.csvHtml5.available(dt, conf)) {
			return 'csvHtml5';
		}
	},
	excel: function (dt, conf) {
		if (
			_dtButtons.excelHtml5 &&
			_dtButtons.excelHtml5.available(dt, conf)
		) {
			return 'excelHtml5';
		}
	},
	pdf: function (dt, conf) {
		if (_dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available(dt, conf)) {
			return 'pdfHtml5';
		}
	},
	pageLength: function (dt) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = [];
		var lang = [];
		var text = function (dt) {
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
				if ($.isPlainObject(option)) {
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
			buttons: $.map(vals, function (val, i) {
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
	},
	spacer: {
		style: 'empty',
		spacer: true,
		text: function (dt) {
			return dt.i18n('buttons.spacer', '');
		}
	}
});

/**
 * Get the file name for an exported file.
 *
 * @param {object} config Button configuration
 * @param {object} dt DataTable instance
 */
var _filename = function (config, dt) {
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
		filename = filename.replace(/\*/g, $('head > title').text()).trim();
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
 * @param {undefined|string|function} option Option
 * @return {null|string} Resolved value
 */
var _stringOrFunction = function (option, config, dt) {
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
 * @param {object} config	Button configuration
 */
var _title = function (config, dt) {
	var title = _stringOrFunction(config.title, config, dt);

	return title === null
		? null
		: title.indexOf('*') !== -1
		? title.replace(/\*/g, $('head > title').text() || 'Exported data')
		: title;
};

var _message = function (dt, config, option, position) {
	var message = _stringOrFunction(option, config, dt);
	if (message === null) {
		return null;
	}

	var caption = $('caption', dt.table().container()).eq(0);
	if (message === '*') {
		var side = caption.css('caption-side');
		if (side !== position) {
			return null;
		}

		return caption.length ? caption.text() : '';
	}

	return message;
};

var _exportTextarea = $('<textarea/>')[0];
var _exportData = function (dt, inOpts) {
	var config = $.extend(
		true,
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
				header: function (d) {
					return Buttons.stripData(d, config);
				},
				footer: function (d) {
					return Buttons.stripData(d, config);
				},
				body: function (d) {
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
						var inner = $('.dt-column-title', el);

						val = inner.length ? inner.html() : $(el).html();
					}

					return config.format.footer(val, idx, el);
				})
				.toArray()
		: null;

	// If Select is available on this table, and any rows are selected, limit the export
	// to the selected rows. If no rows are selected, all rows will be exported. Specify
	// a `selected` modifier to control directly.
	var modifier = $.extend({}, config.modifier);
	if (
		dt.select &&
		typeof dt.select.info === 'function' &&
		modifier.selected === undefined
	) {
		if (
			dt.rows(config.rows, $.extend({ selected: true }, modifier)).any()
		) {
			$.extend(modifier, { selected: true });
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
		var row = [columns];

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

	var data = {
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

function _headerFormatter(formatter, struct) {
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
