// Type definitions for DataTables Buttons
//
// Project: https://datatables.net/extensions/buttons/, https://datatables.net
// Definitions by:
//   SpryMedia
//   Kiarash Ghiaseddin <https://github.com/Silver-Connection>
//   Sam Germano <https://github.com/SammyG4Free>
//   Jim Hartford <https://github.com/jimhartford>

/// <reference types="jquery" />

import DataTables, {Api} from 'datatables.net';

export default DataTables;


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables' types integration
 */
declare module 'datatables.net' {
	interface Config {
		/**
		 * Buttons extension options
		 */
		buttons?: boolean | ConfigButtons | ButtonsList;
	}

	interface ConfigLanguage {
		/**
		 * Buttons language options
		 */
		buttons?: ConfigButtonsLanguage;
	}

	interface Feature {
		buttons?: ConfigButtons | ButtonsList;
	}

	interface Api<T> {
		/**
		 * Select a single button from the button instances attached to a DataTable.
		 * 
		 * @param groupSelector Button group (instance) selector. Provides the ability to select a button from a specific instance of the Buttons class.
		 * @param buttonSelector Selector to obtain the button that should be acted upon.
		 */
		button: ApiButton<T>;
		
		buttons: ApiButtons<T>;
	}

	interface DataTablesStatic {
		/**
		 * Buttons class
		 */
		Buttons: {
			/**
			 * Create a new Buttons instance for the target DataTable
			 */
			new (dt: Api<any>, settings: boolean | ConfigButtons | ButtonsList): DataTablesStatic['Buttons'];

			/**
			 * Buttons version
			 */
			version: string;

			/**
			 * Default configuration values
			 */
			defaults: ConfigButtons;

			/**
			 * Set the JSZip library that Buttons should use for Excel export
			 * @param jszip JSZip library
			 */
			jszip: (jszip: any) => void;

			/**
			 * Set the PDFMake library that Buttons should use for PDF export
			 * @param pdfMake PDFMake library
			 */
			pdfMake: (pdfMake: any) => void;
		}
	}

	interface DataTablesStaticExtButtons {
		[name: string]: ButtonConfig;

		collection: CollectionButtons['collection'];
	}


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	* Options
	*/

	interface ConfigButtons {
		name?: string;
		tabIndex?: number;
		buttons: ButtonsList;
		dom?: ConfigButtonDom;
	}

	interface ConfigButtonsLanguage {
		[key: string]: string | ConfigButtonsLanguage;
	}


	interface ApiButton<T> {
		(groupSelector?: number | string | Array<number | string>, buttonSelector?: null | number | string | Node | JQuery<HTMLElement> | Array<null | number | string | Node | JQuery<HTMLElement>>): ApiButtonMethods<T>;
	}

	interface ApiButtonMethods<T> extends Api<T> {
		/**
		 * Get the action function for the selected button.
		 * 
		 * @returns The action function for the selected button.
		 */
		action(): FunctionButtonAction;

		/**
		 * Set the action function for the selected button.
		 * 
		 * @param set the function that is to be triggered on an action.
		 * @returns DataTables Api for chaining
		 */
		action(set: FunctionButtonAction): Api<any>;

		/**
		 * Get the active state for the selected button.
		 * 
		 * @returns true if currently active, otherwise false.
		 */
		active(): boolean;

		/**
		 * Set the active state for the selected button.
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the button.
		 */
		active(state: boolean): Api<any>;

		/**
		 * Create a new button, adding it to the selected button instance and inserting immediately into the document.
		 * 
		 * @returns New DataTables API instance with the result set containing the newly created button. This means it is possible to immediately using the chaining API to manipulate the button.
		 */
		add(index: number | string, config: string|Buttons): Api<any>;

		/**
		 * Disable the selected buttons.
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the button.
		 */
		disable(): Api<any>;

		/**
		 * Set the enabled state for the selected button.
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the button.
		 */
		enable(state?: boolean): Api<any>;

		/**
		 * Get a jQuery object that contains a reference to the node for the selected button.
		 * 
		 * @returns A jQuery object that contains the node of the selected button
		 */
		node(): JQuery;

		/**
		 * Determine if a button is currently in the processing state or not.
		 * 
		 * @returns true if the button is currently in its processing state, false otherwise.
		 */
		processing(): boolean;

		/**
		 * Set the processing state for the selected button.
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the buttons.
		 */
		processing(set: boolean): Api<any>;

		/**
		 * Remove the selected button from the display. The button is destroyed and can no longer be used once removed.
		 * 
		 * @returns DataTables API instance.
		 */
		remove(): Api<any>;

		/**
		 * Get the display text for the selected button
		 * 
		 * @returns The current display string from the button.
		 */
		text(): string;

		/**
		 * Set the display text for the selected button
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the buttons.
		 */
		text(title: string | FunctionButtonText): Api<any>;

		/**
		 * Programmatically trigger the action of the selected button.
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the button.
		 */
		trigger(): Api<any>;
	}



	interface ApiButtons<T> {
		(groupSelector?: any, buttonSelector?: any): ApiButtonsMethods<T>;

		/**
		 * Display / hide an information message to the end user to indicate that something has happened.
		 * 
		 * @returns DataTables API instance for chaining.
		 */
		info(title: string, message?: string, time?: number): Api<any>;

		/**
		 * Get meta information that is common to many different button types.
		 * 
		 * @returns An object with properties which contain the filename, messageTop, messageBottom and title.
		 */
		exportInfo(options?: ButtonsApiExportInfoParameter): ButtonsApiExportInfoReturn;

		/**
		 * Obtain data from a DataTable that is suitable for exporting by saving into a file or copying to clipboard.
		 * 
		 * @returns An object with 3 properties, one each for the data in the header, body and footer. 
		 */
		exportData(options?: ButtonsApiExportDataParameter): ButtonsApiExportDataReturn;
	}

	interface ApiButtonsMethods<T> extends Omit<Api<T>, 'trigger'> {
		/**
		 * Get the action function for the selected button.
		 * 
		 * @returns DataTables API instance which contains the action functions for the selected buttons
		 */
		action(): Api<Array<FunctionButtonAction>>;

		/**
		 * Set the action function for the selected button.
		 * 
		 * @param set the function that is to be triggered on an action.
		 * @returns DataTables API instance with the selected buttons in the result set, available for chaining further operations on the buttons.
		 */
		action(set: FunctionButtonAction): Api<Array<any>>;

		/**
		 * Get the active state for the selected button.
		 * 
		 * @returns API instance which contains true if currently active, otherwise false for each selected button in the result set.
		 */
		active(): Api<Array<boolean>>;

		/**
		 * Set the active state for the selected button.
		 * 
		 * @returns DataTables API instance with the selected buttons in the result set, available for chaining further operations on the buttons.
		 */
		active(state: boolean): Api<Array<any>>;

		/**
		 * Get a jQuery instance that contains a reference to the button container instance.
		 */
		container(): JQuery;

		/**
		 * Get a jQuery instance that contains a reference to the button container instances.
		 * 
		 * @returns jQuery instance that contains the container elements for the selected button instances.
		 */
		containers(): JQuery;

		/**
		 * Destroy the selected button instances, removing the container and all button elements from the document.
		 * 
		 * @returns DataTables API instance.
		 */
		destroy(): Api<any>;

		/**
		 * Disable the selected buttons.
		 * 
		 * @returns DataTables API instance with the selected buttons in the result set, available for chaining further operations on the buttons.
		 */
		disable(): Api<Array<any>>;

		/**
		 * Set the enabled state for the selected button.
		 * 
		 * @returns DataTables API instance with the selected buttons in the result set, available for chaining further operations on the buttons.
		 */
		enable(state?: boolean): Api<Array<any>>;

		/**
		 * Get a jQuery object that contains a reference to the node for the selected button.
		 * 
		 * @returns A jQuery object that contains the node of the selected button
		 */
		nodes(): JQuery;

		/**
		 * Set the processing state for the selected button.
		 * 
		 * @returns DataTables API instance with the selected buttons in the result set, available for chaining further operations on the buttons.
		 */
		processing(set: boolean): Api<any>;

		/**
		 * Remove the selected button from the display. The button is destroyed and can no longer be used once removed.
		 * 
		 * @returns DataTables API instance.
		 */
		remove(): Api<any>;

		/**
		 * Get the display text for the selected button
		 * 
		 * @returns The current display string from the button.
		 */
		text(): string;

		/**
		 * Set the display text for the selected button
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the buttons.
		 */
		text(title: string | FunctionButtonText): Api<Array<string>>;

		/**
		 * Programmatically trigger the action of the selected button.
		 * 
		 * @returns DataTables API instance with the selected button in the result set, available for chaining further operations on the button.
		 */
		trigger(): Api<Array<any>>;
	}




	interface ButtonsApiExportInfoParameter {
		extension?: string | (() => string);
		filename?: string | (() => string);
		messageBottom?: null | string | (() => string);
		messageTop?: null | string | (() => string);
		title?: null | string | (() => string);
	}

	interface ButtonsApiExportInfoReturn {
		filename: string;
		messageTop: string;
		messageBottom: string;
		title: string;
	}

	interface ButtonsApiExportDataParameter {
		rows?: any;
		columns?: any;
		modifier?: any;
		orthogonal?: string;
		stripHtml?: boolean;
		stripNewlines?: boolean;
		decodeEntities?: boolean;
		trim?: boolean;
		format?: any;
	}

	interface ButtonsApiExportDataReturn {
		header: string[];
		footer: string[];
		body: string[];
	}

	interface ConfigButtonDom {
		button?: ButtonDomButton;
		buttonContainer?: ButtonDomButtonEl;
		buttonLiner?: ButtonDomButtonEl;
		collection?: ButtonDomButtonEl;
		container?: ButtonDomButtonEl;
	}

	interface ButtonDomButtonEl {
		className?: string;
		tag?: string;
	}

	interface ButtonDomButton extends ButtonDomButtonEl {
		active?: string;
		disabled?: string;
	}

	export interface ButtonConfig {
		/**
		 * Action to take when the button is activated
		 */
		action?: FunctionButtonAction;

		/**
		 * Button HTML attributes
		 */
		attr?: {
			[key: string]: string | number
		};

		/**
		 * Ensure that any requirements have been satisfied before initialising a button
		 */
		available?: FunctionButtonAvailable;

		/**
		 * Set the class name for the button
		 */
		className?: string;

		/**
		 * Function that is called when the button is destroyed
		 */
		destroy?: FunctionButtonInit;

		/**
		 * Set a button's initial enabled state
		 */
		enabled?: boolean;

		/**
		 * Define which button type the button should be based on
		 */
		extend?: string;

		/**
		 * Define spacer button style
		 */
		style?: string;

		/**
		 * Initialisation function that can be used to add events specific to this button
		 */
		init?: FunctionButtonInit;

		/**
		 * Define an activation key for a button
		 */
		key?: string | ButtonKey;

		/**
		 * Set a name for each selection
		 */
		name?: string;

		/**
		 * Unique namespace for every button
		 */
		namespace?: string;

		/**
		 * The text to show in the button
		 */
		text?: string | FunctionButtonText;

		/**
		 * Button 'title' attribute text
		 */
		titleAttr?: string;
	}

	interface ButtonKey {
		key?: string;
		shiftKey?: boolean;
		altKey?: boolean;
		ctrlKey?: boolean;
		metaKey?: boolean;
	}

	/**
	 * A function that will be executed upon creation of the buttons.
	 */
	type FunctionButton = (dt: Api<any>) => ButtonConfig;

	type FunctionButtonText = (dt: Api<any>, node: JQuery, config: any) => string;

	type FunctionButtonAvailable = (dt: Api<any>, config: any) => boolean;

	type FunctionButtonInit = (dt: Api<any>, node: JQuery, config: any) => void;

	type FunctionButtonAction = (e: any, dt: Api<any>, node: JQuery, config: ButtonConfig) => void;

	type FunctionButtonCustomize = (win: Window|string) => void;

	interface CollectionOptions {
		action?: FunctionButtonAction;
		align?: 'button-left' | 'button-right' | 'container' | 'dt-container';
		autoClose?: boolean;
		background?: boolean;
		backgroundClassName?: string;
		buttons: ButtonsList;
		className?: string;
		collectionLayout?: string;
		collectionTitle?: string;
		dropup?: boolean;
		fade?: number;
		popoverTitle?: string;
		postfixButtons?: ButtonsList;
		prefixButtons?: ButtonsList;
		span?: null | 'container' | 'dt-container';
	}

	/**
	 * List of all the button types - can be extended by external libraries
	 */
	export interface Buttons {
		/** Selected columns with individual buttons - toggle column visibility */
		columnsToggle: {
			extend: 'columnsToggle';
			columns?: ColumnSelector;
			columnText?: string;
		};

		/** Single button to toggle column visibility */
		columnToggle: {
			extend: 'columnToggle';
			columns?: ColumnSelector;
			columnText?: string;
		};

		/** Selected columns with individual buttons - set column visibility */
		columnsVisibility: {
			extend: 'columnsVisibility';
			columns?: ColumnSelector;
			columnText?: string;
			visibility: boolean;
		};

		/** Single button to set column visibility */
		columnVisibility: {
			extend: 'columnVisibility';
			columns?: ColumnSelector;
			columnText?: string;
			visibility: boolean;
		};

		/** Restore column visibility to what it was when the table loaded */
		colvisRestore: {
			extend: 'colvisRestore';
		};

		/** Set the column visibility for columns (both show and hide) */
		colvisGroup: {
			extend: 'colvisGroup';
			show: ColumnSelector;
			hide: ColumnSelector;
		};

		/** Copy table data to clipboard */
		copy: {
			extend: 'copy';
			exportOptions?: ButtonExportOptions;
			fieldSeparator?: string;
			fieldBoundary?: string;
			header?: boolean;
			footer?: boolean;
			title?: string;
			messageTop?: string;
			messageBottom?: string;
		};

		copyHtml5: Buttons['copy'];

		/** Create a CSV file with the table data */
		csv: {
			extend: 'csv',
			filename?: string;
			extension?: string;
			exportOptions?: ButtonExportOptions,
			fieldSeparator?: string;
			fieldBoundary?: string;
			escapeChar?: string;
			charset?: string | null;
			header?: boolean;
			footer?: boolean;
		};

		csvHtml5: Buttons['csv'];

		/** Create an Excel XLSX file with the table data */
		excel: {
			extend: 'excel',
			filename?: string;
			extension?: string;
			exportOptions?: ButtonExportOptions,
			header?: boolean;
			footer?: boolean;
			title?: string;
			messageTop?: string;
			messageBottom?: string;
			createEmptyCells?: boolean;
			autoFilter?: boolean;
			sheetName?: string;
			customize?: null | ((win: Window, conf: Buttons['print'], dt: Api<any>) => void);
		};

		excelHtml5: Buttons['excel'];

		/** Construct a view of the table suitable for printing */
		print: {
			extend: 'print',
			title?: string;
			messageTop?: string;
			messageBottom?: string;
			exportOptions?: ButtonExportOptions,
			header?: boolean;
			footer?: boolean;
			autoPrint?: boolean;
			customize?: null | ((xlsx: any, conf: Buttons['print'], dt: Api<any>) => void);
			customizeZip?: null | ((zip: any, data: any, filename: any) => void);
		};

		/** Create a PDF file with the table data */
		pdf: {
			extend: 'pdf',
			title?: string;
			filename?: string;
			extension?: string;
			exportOptions?: ButtonExportOptions,
			orientation?: string;
			pageSize?: string;
			header?: true,
			footer?: true,
			messageTop?: string;
			messageBottom?: string;
			customize?: null | ((doc: any, config: Buttons['pdf'], dt: Api<any>) => void),
			download?: 'download' | 'open'
		};

		pdfHtml5: Buttons['pdf'];

		/** A spacer to visually separate buttons (not a real button!) */
		space: {
			spacer: boolean;
			style: 'empty' | 'bar';
		};
	}

	export interface CollectionButtons {
		/** Collection button */
		collection: {
			extend?: 'collection',
		};

		/** A collection of column visibility buttons */
		colvis: {
			extend?: 'colvis',
			columns?: ColumnSelector;
			columnText?: string;
		};

		/** Set the table's paging length */
		pageLength: {
			extend?: 'pageLength'
		}

		/** Split buttons */
		split: {}
	}

	type ButtonsList = Array<
		ButtonConfig |
		keyof Buttons |
		(Buttons[keyof Buttons] | ButtonConfig) |
		keyof CollectionButtons |
		(CollectionButtons[keyof CollectionButtons] | CollectionOptions) |
		FunctionButton
	>;

	type ButtonSelectorTypes = string | number | JQuery<any>;

	interface ButtonExportOptions {
		rows?: any;
		columns?: ButtonSelectorTypes | ButtonSelectorTypes[];
		modifier?: any;
		orthogonal?: string;
		stripHtml?: boolean;
		stripNewlines?: boolean;
		decodeEntities?: boolean;
		trim?: boolean;
		format?: {
			header?: any;
			footer?: any;
			body?: any;
			customizeData?: any;
		}
	}

	type FunctionButtonCustomizeData = (content: any) => void;

	type FunctionButtonColvisColumnText = (dt: Api<any>, i: number, title: string) => string;

	type FunctionButtonCustomizeZip = (zip: any, data: ButtonsApiExportDataReturn, filename: string) => void;
}
