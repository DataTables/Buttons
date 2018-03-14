(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net', 'datatables.net-buttons'], function ($) {
            return factory($, window, document);
        });
    }
    else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                $ = require('datatables.net')(root, $).$;
            }

            if (!$.fn.dataTable.Buttons) {
                require('datatables.net-buttons')(root, $);
            }

            return factory($, root, root.document);
        };
    }
    else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';
    var DataTable = $.fn.dataTable;


    var _link = document.createElement('a');

    /**
     * Clone link and style tags, taking into account the need to change the source
     * path.
     *
     * @param  {node}     el Element to convert
     */
    var _styleToAbs = function (el) {
        var url;
        var clone = $(el).clone()[0];
        var linkHost;

        if (clone.nodeName.toLowerCase() === 'link') {
            clone.href = _relToAbs(clone.href);
        }

        return clone.outerHTML;
    };

    /**
     * Convert a URL from a relative to an absolute address so it will work
     * correctly in the popup window which has no base URL.
     *
     * @param  {string} href URL
     */
    var _relToAbs = function (href) {
        // Assign to a link on the original page so the browser will do all the
        // hard work of figuring out where the file actually is
        _link.href = href;
        var linkHost = _link.host;

        // IE doesn't have a trailing slash on the host
        // Chrome has it on the pathname
        if (linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
            linkHost += '/';
        }

        return _link.protocol + "//" + linkHost + _link.pathname + _link.search;
    };


    var counter = 0;

    DataTable.ext.buttons.print = {
        className: 'buttons-print',

        text: function (dt) {
            return dt.i18n('buttons.print', 'Print');
        },
        action: function (e, dt, button, config) {
            var data = dt.buttons.exportData(
                $.extend({decodeEntities: false}, config.exportOptions) // XSS protection
            );
            var exportInfo = dt.buttons.exportInfo(config);

            var addRow = function (d, tag) {
                var str = '<tr>';

                for (var i = 0, ien = d.length; i < ien; i++) {
                    str += '<' + tag + '>' + d[i] + '</' + tag + '>';
                }

                return str + '</tr>';
            };

            // Construct a table for printing
            var html = '<table class="' + dt.table().node().className + '">';

            if (config.header) {
                html += '<thead>' + addRow(data.header, 'th') + '</thead>';
            }

            html += '<tbody>';
            for (var i = 0, ien = data.body.length; i < ien; i++) {
                html += addRow(data.body[i], 'td');
            }
            html += '</tbody>';

            if (config.footer && data.footer) {
                html += '<tfoot>' + addRow(data.footer, 'th') + '</tfoot>';
            }
            html += '</table>';

            //generate an iframe for printing
            counter++;
            var idPrefix = "printArea_";
            $("[id^=" + idPrefix + "]").remove();

            var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
            var iframe;

            try {
                iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                $(iframe).attr({style: iframeStyle, id: idPrefix + counter, src: "#" + new Date().getTime()});
                iframe.doc = null;
                iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
            }
            catch (e) {
                throw e + ". iframes may not be supported in this browser.";
            }

            if (iframe.doc == null) throw "Cannot find document.";

            var win = iframe.contentWindow;
            var doc = iframe.doc;

            // Inject the title and also a copy of the style and link tags from this
            // document so the table can retain its base styling. Note that we have
            // to use string manipulation as IE won't allow elements to be created
            // in the host document and then appended to the new window.
            var head = '<title>' + exportInfo.title + '</title>';
            $('style, link').each(function () {
                head += _styleToAbs(this);
            });

            doc.write('<head>' + head + '</head>' +
                '<h1>' + exportInfo.title + '</h1>' +
                '<div>' + (exportInfo.messageTop || '') + '</div>' +
                '<body>' + html + '</body>' +
                '<div>' + (exportInfo.messageBottom || '') + '</div>'); // Work around for Edge

            $(doc.body).addClass('dt-print-view');

            $('img', doc.body).each(function (i, img) {
                img.setAttribute('src', _relToAbs(img.getAttribute('src')));
            });

            if (config.customize) {
                config.customize(win);
            }

            setTimeout(function () {
                $(doc).ready(function () {
                    win.focus();
                    win.print();
                });
            }, 1000);
        },

        title: '*',

        messageTop: '*',

        messageBottom: '*',

        exportOptions: {},

        header: true,

        footer: false,

        autoPrint: true,

        customize: null
    };


    return DataTable.Buttons;
}));
    </script>
    <script type="text/javascript">
        /*!
	* Print button for Buttons and DataTables.
	* 2016 SpryMedia Ltd - datatables.net/license
	*/

        (function (factory) {
            if (typeof define === 'function' && define.amd) {
                // AMD
                define(['jquery', 'datatables.net', 'datatables.net-buttons'], function ($) {
                    return factory($, window, document);
                });
            }
            else if (typeof exports === 'object') {
                // CommonJS
                module.exports = function (root, $) {
                    if (!root) {
                        root = window;
                    }

                    if (!$ || !$.fn.dataTable) {
                        $ = require('datatables.net')(root, $).$;
                    }

                    if (!$.fn.dataTable.Buttons) {
                        require('datatables.net-buttons')(root, $);
                    }

                    return factory($, root, root.document);
                };
            }
            else {
                // Browser
                factory(jQuery, window, document);
            }
        }(function ($, window, document, undefined) {
            'use strict';
            var DataTable = $.fn.dataTable;


            var _link = document.createElement('a');

            /**
             * Clone link and style tags, taking into account the need to change the source
             * path.
             *
             * @param  {node}     el Element to convert
             */
            var _styleToAbs = function (el) {
                var url;
                var clone = $(el).clone()[0];
                var linkHost;

                if (clone.nodeName.toLowerCase() === 'link') {
                    clone.href = _relToAbs(clone.href);
                }

                return clone.outerHTML;
            };

            /**
             * Convert a URL from a relative to an absolute address so it will work
             * correctly in the popup window which has no base URL.
             *
             * @param  {string} href URL
             */
            var _relToAbs = function (href) {
                // Assign to a link on the original page so the browser will do all the
                // hard work of figuring out where the file actually is
                _link.href = href;
                var linkHost = _link.host;

                // IE doesn't have a trailing slash on the host
                // Chrome has it on the pathname
                if (linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
                    linkHost += '/';
                }

                return _link.protocol + "//" + linkHost + _link.pathname + _link.search;
            };


            var counter = 0;

            DataTable.ext.buttons.print = {
                className: 'buttons-print',

                text: function (dt) {
                    return dt.i18n('buttons.print', 'Print');
                },
                action: function (e, dt, button, config) {
                    var data = dt.buttons.exportData(
                        $.extend({decodeEntities: false}, config.exportOptions) // XSS protection
                    );
                    var exportInfo = dt.buttons.exportInfo(config);

                    var addRow = function (d, tag) {
                        var str = '<tr>';

                        for (var i = 0, ien = d.length; i < ien; i++) {
                            str += '<' + tag + '>' + d[i] + '</' + tag + '>';
                        }

                        return str + '</tr>';
                    };

                    // Construct a table for printing
                    var html = '<table class="' + dt.table().node().className + '">';

                    if (config.header) {
                        html += '<thead>' + addRow(data.header, 'th') + '</thead>';
                    }

                    html += '<tbody>';
                    for (var i = 0, ien = data.body.length; i < ien; i++) {
                        html += addRow(data.body[i], 'td');
                    }
                    html += '</tbody>';

                    if (config.footer && data.footer) {
                        html += '<tfoot>' + addRow(data.footer, 'th') + '</tfoot>';
                    }
                    html += '</table>';

                    //generate an iframe for printing
                    counter++;
                    var idPrefix = "printArea_";
                    $("[id^=" + idPrefix + "]").remove();

                    var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
                    var iframe;

                    try {
                        iframe = document.createElement('iframe');
                        document.body.appendChild(iframe);
                        $(iframe).attr({style: iframeStyle, id: idPrefix + counter, src: "#" + new Date().getTime()});
                        iframe.doc = null;
                        iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
                    }
                    catch (e) {
                        throw e + ". iframes may not be supported in this browser.";
                    }

                    if (iframe.doc == null) throw "Cannot find document.";

                    var win = iframe.contentWindow;
                    var doc = iframe.doc;

                    // Inject the title and also a copy of the style and link tags from this
                    // document so the table can retain its base styling. Note that we have
                    // to use string manipulation as IE won't allow elements to be created
                    // in the host document and then appended to the new window.
                    var head = '<title>' + exportInfo.title + '</title>';
                    $('style, link').each(function () {
                        head += _styleToAbs(this);
                    });

                    doc.write('<head>' + head + '</head>' +
                        '<h1>' + exportInfo.title + '</h1>' +
                        '<div>' + (exportInfo.messageTop || '') + '</div>' +
                        '<body>' + html + '</body>' +
                        '<div>' + (exportInfo.messageBottom || '') + '</div>'); // Work around for Edge

                    $(doc.body).addClass('dt-print-view');

                    $('img', doc.body).each(function (i, img) {
                        img.setAttribute('src', _relToAbs(img.getAttribute('src')));
                    });

                    if (config.customize) {
                        config.customize(win);
                    }

                    setTimeout(function () {
                        $(doc).ready(function () {
                            win.focus();
                            win.print();
                        });
                    }, 1000);
                },

                title: '*',

                messageTop: '*',

                messageBottom: '*',

                exportOptions: {},

                header: true,

                footer: false,

                autoPrint: true,

                customize: null
            };


            return DataTable.Buttons;
        }));
