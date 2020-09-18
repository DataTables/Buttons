// Type definitions for JQuery DataTables Buttons extension 1.4
// Project: http://datatables.net/extensions/buttons/, https://datatables.net
// Definitions by: Kiarash Ghiaseddin <https://github.com/Silver-Connection>, Sam Germano <https://github.com/SammyG4Free>, Jim Hartford <https://github.com/jimhartford>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/// <reference types="jquery" />
/// <reference types="datatables.net"/>

declare namespace DataTables {
    interface Settings {
        /**
         * Buttons extension options
         */
        buttons?: boolean | string[] | ButtonsSettings | ButtonSettings[];
    }

    interface LanguageSettings {
        buttons?: {};
    }

    interface StaticFunctions {
        Buttons: ButtonStaticFunctions;
    }

    interface ButtonStaticFunctions {
        new (dt: Api<any>, settings: boolean | string[] | ButtonsSettings | ButtonSettings[]): undefined;
        version: string;
        defaults: ButtonsSettings;
    }

    interface ExtSettings {
        buttons: ExtButtonsSettings;
    }

    interface Api<T> {
        /**
         * Select a single button from the button instances attached to a DataTable.
         * 
         * @param groupSelector Button group (instance) selector. Provides the ability to select a button from a specific instance of the Buttons class.
         * @param buttonSelector Selector to obtain the button that should be acted upon.
         */
        button(groupSelector?: number | string | Array<number | string>, buttonSelector?: null | number | string | Node | JQuery<HTMLElement> | Array<null | number | string | Node | JQuery<HTMLElement>>): ButtonApi;
        buttons: ButtonsGlobalApi;
    }

    interface ButtonsGlobalApi {
        (groupSelector?: any, buttonSelector?: any): ButtonsApi;

        /**
         * Resize the Flash movie clips to take account of the current button dimensions.
         * 
         * @returns Unmodified DataTable API instance for chaining
         */
        resize(): Api<any>;

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

    interface ButtonApi {
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
        add(index: number | string, config: string|FunctionButtom|ButtonSettings): Api<any>;

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

    interface ButtonsApi {
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

    //#region "Button Settings"

    interface ButtonsSettings {
        name?: string;
        tabIndex?: number;
        buttons: Array<string|FunctionButtom|ButtonSettings>;
        dom?: ButtonDomSettings;
    }

    interface ButtonDomSettings {
        button?: ButtonDomButtomButton;
        buttonContainer?: ButtonDomButtomCommon;
        buttonLiner?: ButtonDomButtomCommon;
        collection?: ButtonDomButtomCommon;
        container?: ButtonDomButtomCommon;
    }

    interface ButtonDomButtomCommon {
        className?: string;
        tag?: string;
    }

    interface ButtonDomButtomButton extends ButtonDomButtomCommon {
        active?: string;
        disabled?: string;
    }

    interface ButtomSettingsCommon {
        /**
         * Action to take when the button is activated
         */
        action?: FunctionButtonAction;

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
    type FunctionButtom = (dt: Api<any>) => ButtomSettingsCommon;

    type FunctionButtonText = (dt: Api<any>, node: JQuery, config: any) => string;

    type FunctionButtonAvailable = (dt: Api<any>, config: any) => boolean;

    type FunctionButtonInit = (dt: Api<any>, node: JQuery, config: any) => void;

    type FunctionButtonAction = (e: any, dt: Api<any>, node: JQuery, config: ButtonSettings) => void;

    type FunctionButtonCustomize = (win: Window|string) => void;

    type FunctionExtButtonsCollectionText = (a: any) => string;

    interface ExtButtonsSettings {
        collection: ExtButtonsCollectionSettings;
    }

    interface ExtButtonsCollectionSettings {
        action: FunctionButtonAction;
        autoClose: boolean;
        background: boolean;
        backgroundClassName: string;
        className: string;
        collectionLayout: string;
        fade: number;
        text: FunctionExtButtonsCollectionText;
    }

    //#endregion "Button Defaults"

    //#region "Add-Ons"

    /**
     * Buttons extension options
     */
    interface ButtonSettings extends ButtomSettingsCommon {
        //#region (HTML-)File-Export

        /**
         * CSV / EXCEL: Define what the exported filename should be
         */
        filename?: string;

        /**
         * COPY / CSV: field separator
         */
        fieldSeparator?: string;

        /**
         * COPY / CSV: field boundary
         */
        fieldBoundary?: string;

        /**
         * COPY / CSV: field separator
         */
        newLine?: string;

        /**
         * CSV / EXCEL / PDF: file extension
         */
        extension?: string;

        /**
         * CSV: UTF-8 boom
         */
        bom?: boolean;

        /**
         * CSV: charset
         */
        charset?: string|boolean;

        /**
         * CSV: escape char
         */
        escapeChar?: string;

        /**
         * EXCEL
         */
        customizeData?: FunctionButtonCustomizeData;

        /**
         * PDF: portrait / landscape
         */
        orientation?: string;

        /**
         * PDF: A3 / A4 / A5 / LEGAL / LETTER / TABLOID
         */
        pageSize?: string;

        //#endregion (HTML-)File-Export

        //#region Export and Print

        /**
         * COPY / CSV / EXCEL / PDF / PRINT: show header
         */
        exportOptions?: ButtonExportOptions | object;

        /**
         * COPY / CSV / EXCEL / PDF / PRINT: show header
         */
        customize?: FunctionButtonCustomize;

        /**
         * COPY / CSV / EXCEL / PDF / PRINT: show header
         */
        header?: boolean;

        /**
         * COPY / CSV / EXCEL / PDF / PRINT: show footer
         */
        footer?: boolean;

        /**
         * COPY / PRINT: title
         */
        title?: string;

        /**
         * COPY / EXCEL / PDF / PRINT: field separator
         */
        messageTop?: string;

        /**
         * COPY / EXCEL / PDF / PRINT: field separator
         */
        messageBottom?: string;

        /**
         * PDF / PRINT: Extra message
         */
        message?: string|Api<any>|JQuery|object;

        /**
         * PRINT: Show print dialoge on click
         */
        autoPrint?: boolean;

        //#endregion Export and Print

        //#region ColVis

        /**
         * COLVIS: Column selector
         */
        columns?: any;

        /**
         * COLVIS:
         */
        columnText?: FunctionButtonColvisColumnText;

        //#endregion ColVis
    }

    type ButtonSelectorTypes = string | number | JQuery<any>;
    interface ButtonExportOptions {
        columns?: ButtonSelectorTypes | ButtonSelectorTypes[];
    }

    type FunctionButtonCustomizeData = (content: any) => void;

    type FunctionButtonColvisColumnText = (dt: Api<any>, i: number, title: string) => string;

    //#endregion "button-settings
}
